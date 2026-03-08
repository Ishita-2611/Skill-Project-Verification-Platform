import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { verificationAPI } from '../services/api'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalVerifications:0, approvedVerifications:0 })

  useEffect(() => {
    if (user) {
      verificationAPI.getReviewerStats()
        .then(res => setStats(res.data.stats || {}))
        .catch(() => {})
    }
  }, [user])

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.username}! 👋</h2>
          <p className="text-blue-100">Manage your projects and verify others' work in the TrustChain ecosystem</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm font-semibold mb-1">REPUTATION SCORE</div>
            <div className="text-3xl font-bold text-gray-800">{user?.reputationScore || 0}</div>
            <p className="text-gray-600 text-sm mt-2">Your trustworthiness rating</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm font-semibold mb-1">VERIFIED PROJECTS</div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalVerifications}</div>
            <p className="text-gray-600 text-sm mt-2">Projects you've verified</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm font-semibold mb-1">VERIFICATION COUNT</div>
            <div className="text-3xl font-bold text-gray-800">{stats.approvedVerifications}</div>
            <p className="text-gray-600 text-sm mt-2">Reviews received</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/projects')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              📁 View My Projects
            </button>
            <button
              onClick={() => navigate('/projects/upload')}
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              📤 Upload New Project
            </button>
            <button
              onClick={() => navigate('/verify')}
              className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
            >
              ✓ Verify Projects
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
            >
              👤 Edit Profile
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
