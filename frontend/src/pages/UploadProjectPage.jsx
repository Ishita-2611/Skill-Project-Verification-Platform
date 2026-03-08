import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import Layout from '../components/Layout'
import ErrorMessage from '../components/ErrorMessage'
import SuccessMessage from '../components/SuccessMessage'
import LoadingSpinner from '../components/LoadingSpinner'

export default function UploadProjectPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { uploadProject, loading } = useProjects()
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validTypes = ['application/zip', 'application/pdf', 'image/png', 'image/jpeg', 'text/markdown']
      if (!validTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Allowed: ZIP, PDF, PNG, JPG, MD')
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File too large. Maximum size: 10MB')
        return
      }
      setFile(selectedFile)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!title || !description || !skills || !file) {
      setError('Please fill in all fields')
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('skills', skills.split(',').map(s => s.trim()).join(','))
      formData.append('file', file)

      await uploadProject(formData)
      setSuccess('Project uploaded successfully!')
      setTimeout(() => navigate('/projects'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload Project</h1>

        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        {loading && <LoadingSpinner />}

        {!loading && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                placeholder="My Awesome Project"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                rows="5"
                placeholder="Describe what this project is about, what technologies you used, and key features..."
              />
            </div>

            {/* Skills Used */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills Used (comma-separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                placeholder="React, Node.js, MongoDB, TailwindCSS"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                  accept=".zip,.pdf,.png,.jpg,.jpeg,.md"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <div className="text-gray-600">
                    {file ? (
                      <>
                        <p className="font-semibold mb-1">✓ {file.name}</p>
                        <p className="text-sm text-gray-500">Click to change</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold mb-1">📁 Click or drag to upload</p>
                        <p className="text-sm text-gray-500">ZIP, PDF, PNG, JPG, or MD (Max 10MB)</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Upload Project
              </button>
              <button
                type="button"
                onClick={() => navigate('/projects')}
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
