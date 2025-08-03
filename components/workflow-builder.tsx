'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Settings, 
  Play, 
  Save, 
  X,
  Check,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Bot,
  Database,
  Shield,
  GitBranch,
  Target,
  Workflow,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WorkflowStep, WorkflowDefinition } from '@/lib/agent-fleet'
import { AgentType } from '@/lib/agent-types'

interface WorkflowBuilderProps {
  className?: string
  onSave?: (workflow: WorkflowDefinition) => void
  initialWorkflow?: WorkflowDefinition
}

interface WorkflowNode {
  id: string
  type: 'agent' | 'condition' | 'trigger' | 'output'
  agentType?: AgentType
  action?: string
  parameters?: Record<string, any>
  position: { x: number; y: number }
  connections: string[]
  label: string
  description?: string
}

interface WorkflowConnection {
  id: string
  from: string
  to: string
  condition?: string
}

export default function WorkflowBuilder({ className = '', onSave, initialWorkflow }: WorkflowBuilderProps) {
  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [connections, setConnections] = useState<WorkflowConnection[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [workflowName, setWorkflowName] = useState('New Workflow')
  const [workflowDescription, setWorkflowDescription] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  // Agent type configurations
  const agentConfigs = {
    orchestrator: {
      icon: GitBranch,
      color: 'bg-blue-500',
      actions: ['route', 'coordinate', 'distribute', 'aggregate']
    },
    planning: {
      icon: Target,
      color: 'bg-green-500',
      actions: ['analyze', 'plan', 'strategize', 'optimize']
    },
    execution: {
      icon: Zap,
      color: 'bg-yellow-500',
      actions: ['execute', 'call', 'process', 'transform']
    },
    notion: {
      icon: Database,
      color: 'bg-purple-500',
      actions: ['read', 'write', 'search', 'update']
    },
    claude: {
      icon: Bot,
      color: 'bg-orange-500',
      actions: ['generate', 'summarize', 'analyze', 'reason']
    },
    gpt: {
      icon: Bot, // Assuming Bot is the icon for gpt
      color: 'bg-pink-500',
      actions: ['generate', 'classify', 'translate', 'code']
    }
  }

  useEffect(() => {
    if (initialWorkflow) {
      setWorkflowName(initialWorkflow.name)
      setWorkflowDescription(initialWorkflow.description)
      // Convert workflow steps to nodes
      const workflowNodes = initialWorkflow.steps.map((step, index) => ({
        id: step.id,
        type: 'agent' as const,
        agentType: step.agentType,
        action: step.action,
        parameters: step.parameters,
        position: { x: index * 200 + 100, y: 200 },
        connections: [],
        label: step.name,
        description: step.description
      }))
      setNodes(workflowNodes)
    }
  }, [initialWorkflow])

  const addNode = (type: AgentType, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'agent',
      agentType: type,
      action: agentConfigs[type].actions[0],
      parameters: {},
      position,
      connections: [],
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Agent`,
      description: `Configure ${type} agent actions and parameters`
    }
    setNodes([...nodes, newNode])
    setSelectedNode(newNode)
  }

  const removeNode = (nodeId: string) => {
    setNodes(nodes.filter(node => node.id !== nodeId))
    setConnections(connections.filter(conn => conn.from !== nodeId && conn.to !== nodeId))
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null)
    }
  }

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ))
    if (selectedNode?.id === nodeId) {
      setSelectedNode({ ...selectedNode, ...updates })
    }
  }

  const addConnection = (from: string, to: string) => {
    const newConnection: WorkflowConnection = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from,
      to
    }
    setConnections([...connections, newConnection])
  }

  const removeConnection = (connectionId: string) => {
    setConnections(connections.filter(conn => conn.id !== connectionId))
  }

  const handleNodeDrag = (nodeId: string, e: any, info: any) => {
    updateNode(nodeId, {
      position: {
        x: info.point.x - dragOffset.x,
        y: info.point.y - dragOffset.y
      }
    })
  }

  const handleNodeSelect = (node: WorkflowNode) => {
    setSelectedNode(node)
  }

  const handleSave = () => {
    const workflow: WorkflowDefinition = {
      id: initialWorkflow?.id || `workflow_${Date.now()}`,
      name: workflowName,
      description: workflowDescription,
      steps: nodes.map(node => ({
        id: node.id,
        name: node.label,
        agentType: node.agentType!,
        action: node.action!,
        parameters: node.parameters || {},
        timeout: 30000,
        retryCount: 3
      })),
      triggers: [],
      retryPolicy: {
        maxRetries: 3,
        backoffMultiplier: 2,
        maxBackoff: 30000
      },
      timeout: 300000,
      version: '1.0.0',
      createdAt: initialWorkflow?.createdAt || Date.now(),
      updatedAt: Date.now()
    }
    
    if (onSave) {
      onSave(workflow)
    }
  }

  const renderNode = (node: WorkflowNode) => {
    const config = node.agentType ? agentConfigs[node.agentType] : null
    const Icon = config?.icon || Bot

    return (
      <motion.div
        key={node.id}
        drag
        dragMomentum={false}
        onDragStart={(e, info) => {
          setIsDragging(true)
          setDragOffset({ x: info.point.x - node.position.x, y: info.point.y - node.position.y })
        }}
        onDragEnd={() => setIsDragging(false)}
        onDrag={(e, info) => handleNodeDrag(node.id, e, info)}
        onClick={() => handleNodeSelect(node)}
        className={`absolute cursor-move ${selectedNode?.id === node.id ? 'ring-2 ring-teal-500' : ''}`}
        style={{
          left: node.position.x,
          top: node.position.y,
          transform: `scale(${zoom})`
        }}
      >
        <Card className={`glass-panel w-48 ${config?.color} bg-opacity-20 border-opacity-50`}>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-white" />
              <span className="text-sm font-medium glass-text-white">{node.label}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="glass-text-teal">Type</span>
                <span className="glass-text-white">{node.agentType}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="glass-text-teal">Action</span>
                <span className="glass-text-white">{node.action}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <Button
                size="sm"
                variant="outline"
                className="glass-button text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  removeNode(node.id)
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                {node.connections.length} connections
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderConnection = (connection: WorkflowConnection) => {
    const fromNode = nodes.find(n => n.id === connection.from)
    const toNode = nodes.find(n => n.id === connection.to)
    
    if (!fromNode || !toNode) return null

    const fromPos = {
      x: fromNode.position.x + 96, // Half of node width
      y: fromNode.position.y + 24  // Half of node height
    }
    const toPos = {
      x: toNode.position.x,
      y: toNode.position.y + 24
    }

    return (
      <svg
        key={connection.id}
        className="absolute pointer-events-none"
        style={{
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${zoom})`
        }}
      >
        <defs>
          <marker
            id={`arrow-${connection.id}`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon
              points="0,0 0,6 9,3"
              fill="#10b981"
            />
          </marker>
        </defs>
        <line
          x1={fromPos.x}
          y1={fromPos.y}
          x2={toPos.x}
          y2={toPos.y}
          stroke="#10b981"
          strokeWidth="2"
          markerEnd={`url(#arrow-${connection.id})`}
          className="cursor-pointer hover:stroke-teal-400"
          onClick={() => removeConnection(connection.id)}
        />
      </svg>
    )
  }

  return (
    <div className={`h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="glass-input w-64"
            placeholder="Workflow name"
          />
          <Button variant="outline" size="sm" className="glass-button">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" className="glass-button">
            <Play className="w-4 h-4 mr-2" />
            Test
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="glass-button">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="glass-text-white text-sm">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="sm" className="glass-button">
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 bg-white/5 border-r border-white/10 p-4">
          <div className="space-y-6">
            {/* Agent Types */}
            <div>
              <h3 className="glass-text-white font-medium mb-3">Agent Types</h3>
              <div className="space-y-2">
                {Object.entries(agentConfigs).map(([type, config]) => {
                  const Icon = config.icon
                  return (
                    <div
                      key={type}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => addNode(type as AgentType, { x: 100, y: 100 })}
                    >
                      <div className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="glass-text-white font-medium text-sm">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                        <p className="glass-text-teal text-xs">{config.actions.length} actions</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Selected Node Properties */}
            {selectedNode && (
              <div>
                <h3 className="glass-text-white font-medium mb-3">Node Properties</h3>
                <div className="space-y-3">
                  <div>
                    <label className="glass-text-teal text-sm">Label</label>
                    <Input
                      value={selectedNode.label}
                      onChange={(e) => updateNode(selectedNode.id, { label: e.target.value })}
                      className="glass-input"
                    />
                  </div>
                  
                  {selectedNode.agentType && (
                    <div>
                      <label className="glass-text-teal text-sm">Action</label>
                      <Select
                        value={selectedNode.action}
                        onValueChange={(value) => updateNode(selectedNode.id, { action: value })}
                      >
                        <SelectTrigger className="glass-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {agentConfigs[selectedNode.agentType].actions.map(action => (
                            <SelectItem key={action} value={action}>
                              {action}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div>
                    <label className="glass-text-teal text-sm">Description</label>
                    <Textarea
                      value={selectedNode.description || ''}
                      onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
                      className="glass-input"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Workflow Info */}
            <div>
              <h3 className="glass-text-white font-medium mb-3">Workflow Info</h3>
              <div className="space-y-3">
                <div>
                  <label className="glass-text-teal text-sm">Description</label>
                  <Textarea
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    className="glass-input"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="glass-text-teal">Nodes</span>
                    <span className="glass-text-white">{nodes.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="glass-text-teal">Connections</span>
                    <span className="glass-text-white">{connections.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full relative bg-gradient-to-br from-slate-800/50 to-purple-800/50"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
              `
            }}
          >
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
              }}
            />

            {/* Connections */}
            {connections.map(renderConnection)}

            {/* Nodes */}
            {nodes.map(renderNode)}

            {/* Connection Lines (for visual feedback) */}
            {isDragging && selectedNode && (
              <svg className="absolute inset-0 pointer-events-none">
                <line
                  x1={selectedNode.position.x + 96}
                  y1={selectedNode.position.y + 24}
                  x2={selectedNode.position.x + 200}
                  y2={selectedNode.position.y + 24}
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 