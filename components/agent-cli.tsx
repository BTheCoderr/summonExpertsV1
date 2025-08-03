'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Terminal, 
  Send, 
  Bot, 
  User, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  History,
  Settings,
  Zap
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  status?: 'pending' | 'success' | 'error';
  metadata?: {
    agent?: string;
    executionTime?: number;
    cost?: number;
  };
}

export default function AgentCLI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        type: 'system',
        content: 'Welcome to Summon Experts Agent CLI! Type your commands to interact with the AI agent fleet.',
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add pending agent message
    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'agent',
      content: 'Processing your command...',
      timestamp: new Date(),
      status: 'pending'
    };

    setMessages(prev => [...prev, agentMessage]);

    try {
      const startTime = Date.now();
      
      const response = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: input,
          sessionId,
          context: {
            userId: 'demo_user',
            timestamp: new Date().toISOString()
          }
        }),
      });

      const result = await response.json();
      const executionTime = Date.now() - startTime;

      if (result.success) {
        // Update agent message with success
        setMessages(prev => prev.map(msg => 
          msg.id === agentMessage.id 
            ? {
                ...msg,
                content: result.data || 'Command executed successfully',
                status: 'success',
                metadata: {
                  agent: 'orchestrator',
                  executionTime,
                  cost: 0.01 // Mock cost
                }
              }
            : msg
        ));
      } else {
        // Update agent message with error
        setMessages(prev => prev.map(msg => 
          msg.id === agentMessage.id 
            ? {
                ...msg,
                content: `Error: ${result.error}`,
                status: 'error'
              }
            : msg
        ));
      }
    } catch (error) {
      // Update agent message with error
      setMessages(prev => prev.map(msg => 
        msg.id === agentMessage.id 
          ? {
              ...msg,
              content: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              status: 'error'
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      default: return null;
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="w-4 h-4" />;
      case 'agent': return <Bot className="w-4 h-4" />;
      case 'system': return <Terminal className="w-4 h-4" />;
      default: return <Terminal className="w-4 h-4" />;
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-500/20 border-blue-500/30';
      case 'agent': return 'bg-green-500/20 border-green-500/30';
      case 'system': return 'bg-purple-500/20 border-purple-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const clearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        type: 'system',
        content: 'Chat history cleared. Welcome back!',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-panel h-[80vh] flex flex-col">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center justify-between">
              <CardTitle className="glass-text-white flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Agent CLI
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  <Zap className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearHistory}
                  className="glass-button"
                >
                  <History className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border ${getMessageColor(message.type)}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getMessageIcon(message.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium glass-text-white">
                        {message.type === 'user' ? 'You' : 
                         message.type === 'agent' ? 'Agent' : 'System'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {getStatusIcon(message.status)}
                    </div>
                    
                    <div className="glass-text-white text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    
                    {message.metadata && (
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                        {message.metadata.executionTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {message.metadata.executionTime}ms
                          </span>
                        )}
                        {message.metadata.cost && (
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            ${message.metadata.cost.toFixed(4)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 p-6">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your command (e.g., 'summarize page 123', 'create task for Q4 planning')"
                  className="flex-1 glass-input"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="glass-button"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
              
              <div className="mt-3 text-xs text-gray-400">
                <p>Available commands: summarize, create_task, analyze_business, search, plan</p>
                <p>Session ID: {sessionId}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 