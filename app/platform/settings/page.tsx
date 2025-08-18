'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, User, Bell, Shield, Palette, Save } from 'lucide-react'

export default function PlatformSettings() {
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    company: 'My Business',
    role: 'Founder'
  })
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    weeklyReports: true,
    milestoneAlerts: false,
    marketInsights: true
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Platform Settings</h1>
        <p className="text-gray-400">Customize your Summon Experts experience</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="w-5 h-5 mr-2 text-teal-400" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">First Name</label>
                <Input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Last Name</label>
                <Input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Email Address</label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Company</label>
                <Input
                  type="text"
                  value={profileData.company}
                  onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bell className="w-5 h-5 mr-2 text-teal-400" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Email Updates</h3>
                  <p className="text-gray-400 text-sm">Receive important updates via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailUpdates}
                  onChange={(e) => setNotifications({...notifications, emailUpdates: e.target.checked})}
                  className="rounded border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Weekly Reports</h3>
                  <p className="text-gray-400 text-sm">Get weekly progress summaries</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.weeklyReports}
                  onChange={(e) => setNotifications({...notifications, weeklyReports: e.target.checked})}
                  className="rounded border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Milestone Alerts</h3>
                  <p className="text-gray-400 text-sm">Get notified when you reach milestones</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.milestoneAlerts}
                  onChange={(e) => setNotifications({...notifications, milestoneAlerts: e.target.checked})}
                  className="rounded border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Market Insights</h3>
                  <p className="text-gray-400 text-sm">Receive industry and market updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.marketInsights}
                  onChange={(e) => setNotifications({...notifications, marketInsights: e.target.checked})}
                  className="rounded border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-teal-400" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Two-Factor Authentication</h3>
                <p className="text-gray-400 text-sm mb-3">Add an extra layer of security to your account</p>
                <Button variant="outline" className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10">
                  Enable 2FA
                </Button>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Password</h3>
                <p className="text-gray-400 text-sm mb-3">Change your account password</p>
                <Button variant="outline" className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10">
                  Change Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Palette className="w-5 h-5 mr-2 text-teal-400" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Theme</h3>
                <p className="text-gray-400 text-sm mb-3">Choose your preferred color scheme</p>
                <div className="flex space-x-3">
                  <Button variant="outline" className="border-teal-500 text-teal-400 bg-teal-500/10">
                    Dark (Current)
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Light
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Auto
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="text-center">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-3"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}

