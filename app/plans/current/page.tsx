import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Plus } from 'lucide-react'

async function getLatestSid(): Promise<string | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3000"
    
    const response = await fetch(`${baseUrl}/api/plan/list`, { 
      cache: "no-store" 
    })
    
    if (!response.ok) return null
    
    const data = await response.json()
    const first = data?.plans?.[0]
    return first?.sid ?? null
  } catch (error) {
    console.error("Error fetching latest plan:", error)
    return null
  }
}

export default async function CurrentPlanPage() {
  const sid = await getLatestSid()
  
  if (sid) {
    redirect(`/plans/${sid}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-2xl mx-auto p-6">
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-400" />
              Current Growth Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-700/50 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">No Saved Plans Yet</h3>
                <p className="text-gray-400 mb-6">
                  You haven't created any strategic plans yet. Start building your 90-day growth strategy!
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <Link href="/plans/new">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Plan
                  </Button>
                </Link>
                <Link href="/strategic-plan">
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    View Strategic Hub
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
