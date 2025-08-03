// Security and Trust System for AI Agent Fleet
import crypto from 'crypto'

export interface AgentAuth {
  agentId: string
  apiKey: string
  permissions: string[]
  rateLimit: {
    requestsPerMinute: number
    requestsPerHour: number
    requestsPerDay: number
  }
  allowedActions: string[]
  allowedResources: string[]
  expiresAt?: number
  createdAt: number
  lastUsed: number
}

export interface UserAuth {
  userId: string
  email: string
  role: 'admin' | 'operator' | 'viewer' | 'developer'
  permissions: string[]
  apiKeys: string[]
  sessionTokens: string[]
  lastLogin: number
  createdAt: number
}

export interface AuditLog {
  id: string
  timestamp: number
  userId?: string
  agentId?: string
  action: string
  resource: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  success: boolean
  errorMessage?: string
  duration: number
  cost?: number
  tokensUsed?: number
}

export interface SecurityConfig {
  maxApiKeyLength: number
  minApiKeyLength: number
  sessionTimeout: number
  maxLoginAttempts: number
  lockoutDuration: number
  requireMFA: boolean
  allowedOrigins: string[]
  rateLimiting: {
    enabled: boolean
    windowMs: number
    maxRequests: number
  }
  inputValidation: {
    enabled: boolean
    maxInputLength: number
    allowedFileTypes: string[]
    maxFileSize: number
  }
  auditLogging: {
    enabled: boolean
    retentionDays: number
    sensitiveFields: string[]
  }
}

class SecurityManager {
  private agentAuths: Map<string, AgentAuth> = new Map()
  private userAuths: Map<string, UserAuth> = new Map()
  private auditLogs: AuditLog[] = []
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map()
  private config: SecurityConfig

  constructor(config: SecurityConfig) {
    this.config = config
  }

  // Agent Authentication
  async registerAgent(agentId: string, permissions: string[] = []): Promise<AgentAuth> {
    const apiKey = this.generateApiKey()
    
    const agentAuth: AgentAuth = {
      agentId,
      apiKey,
      permissions,
      rateLimit: {
        requestsPerMinute: 100,
        requestsPerHour: 1000,
        requestsPerDay: 10000
      },
      allowedActions: ['*'],
      allowedResources: ['*'],
      createdAt: Date.now(),
      lastUsed: Date.now()
    }

    this.agentAuths.set(agentId, agentAuth)
    await this.logAudit('agent_registered', 'agent', { agentId, permissions })
    
    return agentAuth
  }

  async authenticateAgent(agentId: string, apiKey: string): Promise<boolean> {
    const agent = this.agentAuths.get(agentId)
    if (!agent || agent.apiKey !== apiKey) {
      await this.logAudit('agent_auth_failed', 'agent', { agentId, reason: 'invalid_credentials' })
      return false
    }

    // Check if API key is expired
    if (agent.expiresAt && Date.now() > agent.expiresAt) {
      await this.logAudit('agent_auth_failed', 'agent', { agentId, reason: 'expired_key' })
      return false
    }

    // Update last used
    agent.lastUsed = Date.now()
    this.agentAuths.set(agentId, agent)
    
    await this.logAudit('agent_auth_success', 'agent', { agentId })
    return true
  }

  async checkAgentPermission(agentId: string, action: string, resource: string): Promise<boolean> {
    const agent = this.agentAuths.get(agentId)
    if (!agent) return false

    // Check if action is allowed
    if (!agent.allowedActions.includes('*') && !agent.allowedActions.includes(action)) {
      await this.logAudit('agent_permission_denied', 'agent', { agentId, action, resource, reason: 'action_not_allowed' })
      return false
    }

    // Check if resource is allowed
    if (!agent.allowedResources.includes('*') && !agent.allowedResources.includes(resource)) {
      await this.logAudit('agent_permission_denied', 'agent', { agentId, action, resource, reason: 'resource_not_allowed' })
      return false
    }

    return true
  }

  // User Authentication
  async registerUser(email: string, role: UserAuth['role'] = 'viewer'): Promise<UserAuth> {
    const userId = this.generateUserId()
    
    const userAuth: UserAuth = {
      userId,
      email,
      role,
      permissions: this.getDefaultPermissions(role),
      apiKeys: [],
      sessionTokens: [],
      lastLogin: Date.now(),
      createdAt: Date.now()
    }

    this.userAuths.set(userId, userAuth)
    await this.logAudit('user_registered', 'user', { userId, email, role })
    
    return userAuth
  }

  async authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: UserAuth; token?: string }> {
    // In a real implementation, you'd hash the password and check against stored hash
    const user = Array.from(this.userAuths.values()).find(u => u.email === email)
    
    if (!user) {
      await this.logAudit('user_auth_failed', 'user', { email, reason: 'user_not_found' })
      return { success: false }
    }

    // Check login attempts (simplified)
    const loginAttempts = this.getLoginAttempts(email)
    if (loginAttempts >= this.config.maxLoginAttempts) {
      await this.logAudit('user_auth_failed', 'user', { email, reason: 'too_many_attempts' })
      return { success: false }
    }

    // Generate session token
    const token = this.generateSessionToken()
    user.sessionTokens.push(token)
    user.lastLogin = Date.now()
    this.userAuths.set(user.userId, user)

    await this.logAudit('user_auth_success', 'user', { userId: user.userId, email })
    
    return { success: true, user, token }
  }

  async validateSessionToken(token: string): Promise<UserAuth | null> {
    const user = Array.from(this.userAuths.values()).find(u => 
      u.sessionTokens.includes(token)
    )

    if (!user) return null

    // Check if token is expired (simplified)
    const tokenAge = Date.now() - user.lastLogin
    if (tokenAge > this.config.sessionTimeout) {
      // Remove expired token
      user.sessionTokens = user.sessionTokens.filter(t => t !== token)
      this.userAuths.set(user.userId, user)
      return null
    }

    return user
  }

  // Rate Limiting
  async checkRateLimit(identifier: string, limit: 'minute' | 'hour' | 'day'): Promise<boolean> {
    const key = `${identifier}:${limit}`
    const now = Date.now()
    const current = this.rateLimitStore.get(key)

    if (!current || now > current.resetTime) {
      // Reset counter
      const resetTime = now + this.getLimitWindow(limit)
      this.rateLimitStore.set(key, { count: 1, resetTime })
      return true
    }

    if (current.count >= this.getLimitMax(limit)) {
      return false
    }

    current.count++
    this.rateLimitStore.set(key, current)
    return true
  }

  // Request validation
  async validateRequest(request: Request): Promise<{ valid: boolean; user?: UserAuth; agent?: AgentAuth }> {
    try {
      // For demo purposes, always return valid
      // In production, implement proper JWT validation, API key validation, etc.
      return { valid: true };
    } catch (error) {
      return { valid: false };
    }
  }

  // Rate limiting check for sessions
  async checkSessionRateLimit(sessionId: string): Promise<{ allowed: boolean; remaining: number }> {
    try {
      const allowed = await this.checkRateLimit(sessionId, 'minute');
      return { allowed, remaining: 100 }; // Mock remaining requests
    } catch (error) {
      return { allowed: false, remaining: 0 };
    }
  }

  // Audit trail logging
  async logAuditTrail(data: {
    sessionId: string;
    action: string;
    command: string;
    result: any;
    timestamp: string;
  }): Promise<void> {
    await this.logAudit(
      data.action,
      'orchestrator',
      {
        sessionId: data.sessionId,
        command: data.command,
        result: data.result,
        timestamp: data.timestamp
      }
    );
  }

  // Input Validation
  validateInput(input: any, type: 'text' | 'json' | 'file' | 'url'): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (this.config.inputValidation.enabled) {
      switch (type) {
        case 'text':
          if (typeof input !== 'string') {
            errors.push('Input must be a string')
          } else if (input.length > this.config.inputValidation.maxInputLength) {
            errors.push(`Input too long (max ${this.config.inputValidation.maxInputLength} characters)`)
          } else if (this.containsSensitiveData(input)) {
            errors.push('Input contains sensitive data')
          }
          break

        case 'json':
          try {
            const parsed = typeof input === 'string' ? JSON.parse(input) : input
            if (typeof parsed !== 'object' || parsed === null) {
              errors.push('Input must be a valid JSON object')
            }
          } catch {
            errors.push('Invalid JSON format')
          }
          break

        case 'file':
          if (input && input.type) {
            if (!this.config.inputValidation.allowedFileTypes.includes(input.type)) {
              errors.push(`File type not allowed: ${input.type}`)
            }
            if (input.size > this.config.inputValidation.maxFileSize) {
              errors.push(`File too large (max ${this.config.inputValidation.maxFileSize} bytes)`)
            }
          }
          break

        case 'url':
          try {
            const url = new URL(input)
            if (!this.config.allowedOrigins.includes(url.origin)) {
              errors.push(`Origin not allowed: ${url.origin}`)
            }
          } catch {
            errors.push('Invalid URL format')
          }
          break
      }
    }

    return { valid: errors.length === 0, errors }
  }

  // Audit Logging
  async logAudit(
    action: string, 
    resource: string, 
    details: Record<string, any>,
    userId?: string,
    agentId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    if (!this.config.auditLogging.enabled) return

    const auditLog: AuditLog = {
      id: this.generateAuditId(),
      timestamp: Date.now(),
      userId,
      agentId,
      action,
      resource,
      details: this.sanitizeSensitiveData(details),
      ipAddress,
      userAgent,
      success: !details.errorMessage,
      errorMessage: details.errorMessage,
      duration: details.duration || 0,
      cost: details.cost,
      tokensUsed: details.tokensUsed
    }

    this.auditLogs.push(auditLog)

    // Clean old logs
    this.cleanupOldLogs()
  }

  async getAuditLogs(
    filters: {
      userId?: string
      agentId?: string
      action?: string
      resource?: string
      startTime?: number
      endTime?: number
      success?: boolean
    } = {},
    limit: number = 100
  ): Promise<AuditLog[]> {
    let logs = this.auditLogs

    if (filters.userId) {
      logs = logs.filter(log => log.userId === filters.userId)
    }
    if (filters.agentId) {
      logs = logs.filter(log => log.agentId === filters.agentId)
    }
    if (filters.action) {
      logs = logs.filter(log => log.action === filters.action)
    }
    if (filters.resource) {
      logs = logs.filter(log => log.resource === filters.resource)
    }
    if (filters.startTime) {
      logs = logs.filter(log => log.timestamp >= filters.startTime!)
    }
    if (filters.endTime) {
      logs = logs.filter(log => log.timestamp <= filters.endTime!)
    }
    if (filters.success !== undefined) {
      logs = logs.filter(log => log.success === filters.success)
    }

    return logs.slice(-limit)
  }

  // Security Utilities
  private generateApiKey(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`
  }

  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  private generateAuditId(): string {
    return `audit_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`
  }

  private getDefaultPermissions(role: UserAuth['role']): string[] {
    switch (role) {
      case 'admin':
        return ['*']
      case 'operator':
        return ['read', 'write', 'execute', 'monitor']
      case 'developer':
        return ['read', 'write', 'execute']
      case 'viewer':
        return ['read', 'monitor']
      default:
        return []
    }
  }

  private getLimitWindow(limit: 'minute' | 'hour' | 'day'): number {
    switch (limit) {
      case 'minute': return 60 * 1000
      case 'hour': return 60 * 60 * 1000
      case 'day': return 24 * 60 * 60 * 1000
    }
  }

  private getLimitMax(limit: 'minute' | 'hour' | 'day'): number {
    switch (limit) {
      case 'minute': return this.config.rateLimiting.maxRequests
      case 'hour': return this.config.rateLimiting.maxRequests * 60
      case 'day': return this.config.rateLimiting.maxRequests * 60 * 24
    }
  }

  private getLoginAttempts(email: string): number {
    // In a real implementation, you'd track this in a database
    return 0
  }

  private containsSensitiveData(input: string): boolean {
    const sensitivePatterns = [
      /password/i,
      /api[_-]?key/i,
      /secret/i,
      /token/i,
      /private[_-]?key/i,
      /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/, // Credit card
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/ // Email
    ]

    return sensitivePatterns.some(pattern => pattern.test(input))
  }

  private sanitizeSensitiveData(data: Record<string, any>): Record<string, any> {
    const sanitized = { ...data }
    
    for (const field of this.config.auditLogging.sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]'
      }
    }

    return sanitized
  }

  private cleanupOldLogs(): void {
    const cutoff = Date.now() - (this.config.auditLogging.retentionDays * 24 * 60 * 60 * 1000)
    this.auditLogs = this.auditLogs.filter(log => log.timestamp > cutoff)
  }

  // Security Reports
  async generateSecurityReport(): Promise<{
    totalUsers: number
    totalAgents: number
    activeSessions: number
    failedAuthAttempts: number
    rateLimitViolations: number
    recentAuditLogs: number
    securityScore: number
  }> {
    const now = Date.now()
    const last24Hours = now - (24 * 60 * 60 * 1000)

    const failedAuths = this.auditLogs.filter(log => 
      log.action.includes('auth_failed') && log.timestamp > last24Hours
    ).length

    const activeSessions = Array.from(this.userAuths.values()).reduce((sum, user) => 
      sum + user.sessionTokens.length, 0
    )

    const recentLogs = this.auditLogs.filter(log => log.timestamp > last24Hours).length

    // Calculate security score (0-100)
    const securityScore = Math.max(0, 100 - (failedAuths * 5) - (recentLogs > 1000 ? 20 : 0))

    return {
      totalUsers: this.userAuths.size,
      totalAgents: this.agentAuths.size,
      activeSessions,
      failedAuthAttempts: failedAuths,
      rateLimitViolations: 0, // Would track this in real implementation
      recentAuditLogs: recentLogs,
      securityScore
    }
  }
}

// Export singleton instance
export const securityManager = new SecurityManager({
  maxApiKeyLength: 64,
  minApiKeyLength: 32,
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  requireMFA: false,
  allowedOrigins: ['http://localhost:3000', 'https://summonexperts.com'],
  rateLimiting: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  },
  inputValidation: {
    enabled: true,
    maxInputLength: 10000,
    allowedFileTypes: ['text/plain', 'application/json', 'image/jpeg', 'image/png'],
    maxFileSize: 10 * 1024 * 1024 // 10MB
  },
  auditLogging: {
    enabled: true,
    retentionDays: 90,
    sensitiveFields: ['password', 'apiKey', 'secret', 'token', 'privateKey']
  }
})

export default securityManager 