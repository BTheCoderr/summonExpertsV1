'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Search, 
  FileText, 
  CheckCircle, 
  Loader2, 
  Play,
  RefreshCw,
  Zap
} from 'lucide-react';

interface TaskResult {
  taskId: string;
  researcherOut: string;
  summarizerOut: string;
  validatorOut: string;
  success: boolean;
  forking_enabled?: boolean;
  supabase_connected?: boolean;
}

export default function MVPTaskRunner() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TaskResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enableForking, setEnableForking] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  // Check Supabase connection on component mount
  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      const res = await fetch('/api/mvp-orchestrator');
      const data = await res.json();
      setSupabaseStatus(data.supabase_connected ? 'connected' : 'disconnected');
    } catch (error) {
      setSupabaseStatus('disconnected');
    }
  };

  async function runTask() {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/mvp-orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_input: input,
          enable_forking: enableForking
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Task failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }

  const clearResults = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Summon Experts - Multi-Agent Infrastructure</h1>
          <p className="text-gray-300">Test the 3-agent pipeline: Researcher → Summarizer → Validator</p>
          
          {/* Supabase Status */}
          <div className="mt-4 flex justify-center">
            <Badge 
              variant="secondary" 
              className={
                supabaseStatus === 'connected' 
                  ? 'bg-green-500/20 text-green-400' 
                  : supabaseStatus === 'checking'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }
            >
              {supabaseStatus === 'connected' && '✅ Supabase Connected'}
              {supabaseStatus === 'checking' && '⏳ Checking Connection...'}
              {supabaseStatus === 'disconnected' && '❌ Supabase Disconnected'}
            </Badge>
          </div>
          
          {/* Supabase Setup Note */}
          {supabaseStatus === 'disconnected' && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg max-w-2xl mx-auto">
              <p className="text-yellow-400 text-sm">
                <strong>Note:</strong> Supabase is not connected. The multi-agent pipeline will still work, but results won't be logged to the database. 
                See <code className="bg-black/20 px-1 rounded">SUPABASE_SETUP.md</code> for setup instructions.
              </p>
            </div>
          )}
        </div>

        {/* Input Section */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="glass-text-white flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Task Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              rows={4}
              className="glass-input"
              placeholder="Enter your task (e.g., 'Help me plan a GTM strategy for my SaaS startup')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            
            <div className="flex gap-3">
              <Button 
                onClick={runTask}
                disabled={loading || !input.trim()}
                className="glass-button flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {loading ? 'Running Agents...' : 'Run Multi-Agent Task'}
              </Button>
              
              {result && (
                <Button 
                  onClick={clearResults}
                  variant="outline"
                  className="glass-button"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear Results
                </Button>
              )}
            </div>
            
            {/* Forking Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="forking"
                checked={enableForking}
                onChange={(e) => setEnableForking(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="forking" className="text-sm glass-text-teal">
                Enable Agent Forking (runs multiple instances for better results)
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="glass-panel border-red-500/30">
            <CardContent className="pt-6">
              <div className="text-red-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Error: {error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-6">
            {/* Task ID */}
            <Card className="glass-panel">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Task ID: {result.taskId}
                  </Badge>
                  {result.forking_enabled && (
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                      Forking Enabled
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Agent Results */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Researcher */}
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="glass-text-white flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-400" />
                    Researcher
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="glass-text-white text-sm whitespace-pre-wrap">
                    {result.researcherOut}
                  </div>
                </CardContent>
              </Card>

              {/* Summarizer */}
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="glass-text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-400" />
                    Summarizer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="glass-text-white text-sm whitespace-pre-wrap">
                    {result.summarizerOut}
                  </div>
                </CardContent>
              </Card>

              {/* Validator */}
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="glass-text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-400" />
                    Validator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="glass-text-white text-sm whitespace-pre-wrap">
                    {result.validatorOut}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pipeline Flow */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="glass-text-white">Agent Pipeline Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-400" />
                    <span className="glass-text-white">Research</span>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-400" />
                    <span className="glass-text-white">Summarize</span>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    <span className="glass-text-white">Validate</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="glass-text-white">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-xs">1</span>
                </div>
                <div>
                  <span className="glass-text-white font-medium">Researcher:</span>
                  <span className="glass-text-teal"> Investigates your task in depth and returns key insights</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-400 text-xs">2</span>
                </div>
                <div>
                  <span className="glass-text-white font-medium">Summarizer:</span>
                  <span className="glass-text-teal"> Condenses the research into an actionable 3-step summary</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-400 text-xs">3</span>
                </div>
                <div>
                  <span className="glass-text-white font-medium">Validator:</span>
                  <span className="glass-text-teal"> Cross-checks the logic and flags any issues</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 