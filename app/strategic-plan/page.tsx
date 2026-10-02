import Link from "next/link"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Plus, 
  FileText, 
  Calendar, 
  BarChart3,
  Clock,
  ArrowRight
} from 'lucide-react'

type PlanSummary = {
  sid: string
  title: string
  savedAt: string
}

async function getPlans(): Promise<PlanSummary[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3000"
    
    const response = await fetch(`${baseUrl}/api/plan/list`, { 
      cache: "no-store" 
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    return data?.plans || []
  } catch (error) {
    console.error("Error fetching plans:", error)
    return []
  }
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    })
  } catch {
    return isoString
  }
}

export default async function StrategicPlanHubPage() {
  const plans = await getPlans()
  const latestPlan = plans[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Strategic Plan Hub</h1>
          <p className="text-xl text-gray-300">
            Create, manage, and track your 90-day growth plans
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Link href="/plans/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
              <Plus className="w-5 h-5 mr-2" />
              New Growth Plan
            </Button>
          </Link>
          {latestPlan && (
            <Link href={`/plans/${latestPlan.sid}`}>
              <Button variant="outline" className="border-gray-600 text-gray-300 px-6 py-3">
                <FileText className="w-5 h-5 mr-2" />
                Read Current Growth Plan
              </Button>
            </Link>
          )}
        </div>

        {/* Latest Plan Highlight */}
        {latestPlan ? (
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-400" />
                Latest Strategic Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    {latestPlan.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Saved {formatDate(latestPlan.savedAt)}
                    </span>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                </div>
                <Link href={`/plans/${latestPlan.sid}`}>
                  <Button className="bg-green-600 hover:bg-green-700">
                    View Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-panel border-white/10">
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-700/50 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Strategic Plans Yet</h3>
                  <p className="text-gray-400 mb-6">
                    Start your journey with a comprehensive 90-day growth plan created by AI agents.
                  </p>
                </div>
                <Link href="/plans/new">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Plan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-400" />
                OKR Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                AI agents create measurable objectives and key results for your 90-day growth strategy.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-yellow-400" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                Research market opportunities, industry trends, and competitive insights for your business.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-orange-400" />
                Execution Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                Get a detailed 90-day roadmap with timelines, dependencies, and success metrics.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* All Plans */}
        {plans.length > 1 && (
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-400" />
                All Strategic Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {plans.map((plan, index) => (
                  <div key={plan.sid} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="space-y-1">
                      <h4 className="text-white font-medium">{plan.title}</h4>
                      <p className="text-gray-400 text-sm">
                        Saved {formatDate(plan.savedAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {index === 0 && (
                        <Badge className="bg-green-600 text-white text-xs">Latest</Badge>
                      )}
                      <Link href={`/plans/${plan.sid}`}>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Process Overview */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { step: 1, title: "Collect Inputs", desc: "Business details and goals" },
                { step: 2, title: "OKR Planning", desc: "AI creates objectives & KRs" },
                { step: 3, title: "Market Analysis", desc: "Research opportunities" },
                { step: 4, title: "Strategy Development", desc: "Create action plan" },
                { step: 5, title: "Roadmap Creation", desc: "90-day execution plan" }
              ].map((phase, index) => (
                <div key={phase.step} className="text-center space-y-2">
                  <div className="w-10 h-10 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {phase.step}
                  </div>
                  <h4 className="text-white font-medium text-sm">{phase.title}</h4>
                  <p className="text-gray-400 text-xs">{phase.desc}</p>
                  {index < 4 && (
                    <ArrowRight className="w-4 h-4 mx-auto text-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
