import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import Layout from '../components/Layout'
import ErrorMessage from '../components/ErrorMessage'
import SuccessMessage from '../components/SuccessMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import { verificationAPI } from '../services/api'

export default function VerifyProjectPage() {
  const { projectId } = useParams()
  const { currentProject, fetchProjectById, loading: projectLoading } = useProjects()

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [skills, setSkills] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId).catch(() => {})
    }
  }, [projectId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!comment.trim()) {
      setError('Please provide your verification comment')
      setLoading(false)
      return
    }

    try {
      const reviewData = {
        rating,
        comment,
        skills: skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      }
      // call the API directly via our service helper
      await verificationAPI.submitVerification(projectId, reviewData)

      setSuccess('Verification submitted successfully!')
      setTimeout(() => navigate('/verify'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit verification')
      setLoading(false)
    }
  }

  if (projectLoading && !currentProject) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/verify')}
          className="text-blue-600 hover:text-blue-700 mb-6 font-semibold"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-6">Verify Project</h1>

        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        {loading && <LoadingSpinner />}

        {/* show project summary if it exists */}
        {currentProject && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentProject.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {currentProject.description}
            </p>
            {currentProject.skills && currentProject.skills.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-1">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProject.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (1-5)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRating(r)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      rating === r
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-yellow-300'
                    }`}
                  >
                    {r} ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Verified Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills Verified (comma-separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                rows="5"
                placeholder="Provide detailed feedback about the project, what you verified, and any notes..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                Submit Verification
              </button>
              <button
                type="button"
                onClick={() => navigate('/verify')}
                className="flex-1 px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  )
}
