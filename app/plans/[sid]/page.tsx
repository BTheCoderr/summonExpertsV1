import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  BarChart3, 
  Calendar, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Users,
  DollarSign,
  Building
} from 'lucide-react'

type PlanDoc = {
  sid: string
  title: string
  start: string
  end: string
  savedAt: string
  inputs?: any
  okrs?: string
  okrs_draft?: string
  market?: string
  plan?: string
  plan_review?: string
  roadmap?: string
}

async function getPlan(sid: string): Promise<PlanDoc | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3000"
    
    const response = await fetch(`${baseUrl}/api/plan/get?sid=${sid}`, {
      cache: "no-store",
    })
    
    if (!response.ok) return null
    return response.json()
  } catch (error) {
    console.error("Error fetching plan:", error)
    return null
  }
}

function tryParse<T = any>(s?: string): T | null {
  if (!s) return null
  try { 
    return JSON.parse(s) 
  } catch { 
    return null 
  }
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  } catch {
    return isoString
  }
}

export default async function PlanViewerPage({ params }: { params: { sid: string } }) {
  const doc = await getPlan(params.sid)
  if (!doc) return notFound()

  const okrs = tryParse<{ objective: string; keyResults: { description: string; metric: string; target: string }[] }>(doc.okrs)
  const market = tryParse<{ growthOpportunities: { title: string; rationale: string }[]; industryTrends: string[]; bestPractices: string[] }>(doc.market)
  const plan = tryParse<{ initiatives: { title?: string; name?: string; description?: string; priority?: number; steps?: string[] }[] }>(doc.plan)
  const roadmap = tryParse<{ roadmap?: { initiative: string; startWeek?: number; endWeek?: number; keyMilestones?: string[]; successMetrics?: string }[]; rows?: { initiative: string; start: string; end: string; dependencies?: string[]; metric?: string }[] }>(doc.roadmap)

  const initiatives = plan?.initiatives || []
  const roadmapRows = roadmap?.roadmap || roadmap?.rows || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Link href="/strategic-plan">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Strategic Plans
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-white">{doc.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(doc.start)} → {formatDate(doc.end)}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Saved {formatDate(doc.savedAt)}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link href="/plans/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                New Growth Plan
              </Button>
            </Link>
          </div>
        </div>

        {/* Business Overview */}
        {doc.inputs && (
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-400" />
                Business Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-2">Business Details</h4>
                  <div className="space-y-1 text-gray-300 text-sm">
                    <p><strong>Name:</strong> {doc.inputs.businessName || 'Not specified'}</p>
                    <p><strong>Industry:</strong> {doc.inputs.businessDescription || 'Not specified'}</p>
                    <p><strong>Location:</strong> {doc.inputs.location || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">90-Day Goals</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">
                        Revenue: ${doc.inputs.revenueGoal90d?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">
                        Customers: {doc.inputs.customerGoal90d || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Resources</h4>
                  <div className="text-gray-300 text-sm">
                    <p><strong>Availability:</strong> {doc.inputs.hoursPerWeek || 0} hours/week</p>
                    {doc.inputs.challenges && (
                      <p className="mt-2"><strong>Challenges:</strong> {doc.inputs.challenges}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* OKRs */}
        {okrs && (
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-400" />
                Objectives & Key Results (OKRs)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Objective</h4>
                  <p className="text-gray-300 text-lg">{okrs.objective}</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3">Key Results</h4>
                  <div className="grid gap-3">
                    {okrs.keyResults?.map((kr, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-gray-200">{kr.description}</p>
                          <div className="flex space-x-4 mt-1">
                            <Badge variant="outline" className="text-blue-400 border-blue-400">
                              {kr.metric}
                            </Badge>
                            <Badge className="bg-green-600 text-white">
                              Target: {kr.target}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan of Action */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
              Plan of Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            {initiatives.length > 0 ? (
              <div className="space-y-4">
                {initiatives.map((initiative, index) => (
                  <div key={index} className="p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium">
                        {initiative.title || initiative.name || `Initiative ${index + 1}`}
                      </h4>
                      {initiative.priority && (
                        <Badge className="bg-purple-600 text-white">
                          Priority {initiative.priority}
                        </Badge>
                      )}
                    </div>
                    {initiative.description && (
                      <p className="text-gray-300 text-sm mb-3">{initiative.description}</p>
                    )}
                    {initiative.steps && initiative.steps.length > 0 && (
                      <div>
                        <h5 className="text-gray-200 font-medium text-sm mb-2">Steps:</h5>
                        <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm ml-4">
                          {initiative.steps.map((step, stepIndex) => (
                            <li key={stepIndex}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">No structured initiatives found. Raw plan data:</p>
                {doc.plan && (
                  <pre className="text-xs p-4 bg-gray-800/50 rounded-lg text-gray-300 whitespace-pre-wrap overflow-x-auto">
                    {doc.plan}
                  </pre>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Roadmap */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-orange-400" />
              Project Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            {roadmapRows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left p-3 text-gray-300 font-medium">Initiative</th>
                      <th className="text-left p-3 text-gray-300 font-medium">Timeline</th>
                      <th className="text-left p-3 text-gray-300 font-medium">Dependencies</th>
                      <th className="text-left p-3 text-gray-300 font-medium">Success Metric</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roadmapRows.map((row, index) => (
                      <tr key={index} className="border-b border-gray-700/50">
                        <td className="p-3 text-gray-200 font-medium">{row.initiative}</td>
                        <td className="p-3 text-gray-300">
                          {row.startWeek && row.endWeek ? (
                            `Week ${row.startWeek} → Week ${row.endWeek}`
                          ) : row.start && row.end ? (
                            `${formatDate(row.start)} → ${formatDate(row.end)}`
                          ) : (
                            'Timeline TBD'
                          )}
                        </td>
                        <td className="p-3 text-gray-300">
                          {row.dependencies && row.dependencies.length > 0 ? (
                            row.dependencies.join(", ")
                          ) : (
                            <span className="text-gray-500">None</span>
                          )}
                        </td>
                        <td className="p-3 text-gray-300">
                          {row.successMetrics || row.metric || (
                            <span className="text-gray-500">TBD</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">No structured roadmap found. Raw roadmap data:</p>
                {doc.roadmap && (
                  <pre className="text-xs p-4 bg-gray-800/50 rounded-lg text-gray-300 whitespace-pre-wrap overflow-x-auto">
                    {doc.roadmap}
                  </pre>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Market Insights (if available) */}
        {market && (
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-yellow-400" />
                Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {market.growthOpportunities && market.growthOpportunities.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Growth Opportunities</h4>
                    <div className="space-y-2">
                      {market.growthOpportunities.map((opp, index) => (
                        <div key={index} className="p-3 bg-gray-800/30 rounded-lg">
                          <h5 className="text-gray-200 font-medium text-sm">{opp.title}</h5>
                          <p className="text-gray-400 text-xs mt-1">{opp.rationale}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {market.industryTrends && market.industryTrends.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Industry Trends</h4>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      {market.industryTrends.map((trend, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-400 mr-2">•</span>
                          {trend}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
