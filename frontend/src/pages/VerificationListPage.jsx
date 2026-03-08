import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { verificationAPI } from '../services/api'

export default function VerificationListPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await verificationAPI.getAvailableProjects()
        setProjects(res.data.projects || [])
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.error || 'Failed to fetch projects')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Verify Projects</h1>

        <ErrorMessage message={error} />

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No projects available to verify at the moment</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                <button
                  onClick={() => navigate(`/verify/${project._id}`)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-semibold transition"
                >
                  Verify Project
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
