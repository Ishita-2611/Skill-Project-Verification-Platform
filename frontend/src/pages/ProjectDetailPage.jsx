import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const { currentProject, loading, error, fetchProjectById } = useProjects()
  const [verifications, setVerifications] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId)
    }
  }, [projectId])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!currentProject) {
    return (
      <Layout>
        <ErrorMessage message="Project not found" />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/projects')}
          className="text-blue-600 hover:text-blue-700 mb-6 font-semibold"
        >
          ← Back to Projects
        </button>

        {/* Project Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentProject.title}</h1>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                currentProject.status === 'verified' ? 'bg-green-100 text-green-800' :
                currentProject.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                currentProject.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {currentProject.status.charAt(0).toUpperCase() + currentProject.status.slice(1)}
              </span>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{currentProject.description}</p>

          {/* Skills */}
          {currentProject.skills && currentProject.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {currentProject.skills.map((skill) => (
                  <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Verifications</p>
              <p className="text-2xl font-bold text-gray-800">{currentProject.verificationCount || 0}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Endorsements</p>
              <p className="text-2xl font-bold text-gray-800">{currentProject.endorsements || 0}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">IPFS Hash</p>
              <p className="text-xs font-mono text-gray-800 break-all">{currentProject.ipfsHash?.substring(0, 16)}...</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/verify/${currentProject._id}`)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              ✓ Submit Verification
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
