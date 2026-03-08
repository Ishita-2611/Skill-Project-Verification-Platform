import { createContext, useState, useCallback } from 'react'
import { projectAPI } from '../services/api'

export const ProjectContext = createContext()

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [currentProject, setCurrentProject] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMyProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await projectAPI.getMyProjects()
      setProjects(response.data.projects || [])
      return response.data.projects
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch projects'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProjectById = useCallback(async (projectId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await projectAPI.getProjectById(projectId)
      setCurrentProject(response.data.project)
      return response.data.project
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch project'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadProject = useCallback(async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await projectAPI.upload(formData)
      const newProject = response.data.project
      setProjects([...projects, newProject])
      return newProject
    } catch (err) {
      const message = err.response?.data?.message || 'Upload failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [projects])

  const updateProjectStatus = useCallback(async (projectId, status) => {
    setLoading(true)
    setError(null)
    try {
      const response = await projectAPI.updateStatus(projectId, status)
      const updatedProject = response.data.project
      setProjects(projects.map(p => p._id === projectId ? updatedProject : p))
      if (currentProject?._id === projectId) {
        setCurrentProject(updatedProject)
      }
      return updatedProject
    } catch (err) {
      const message = err.response?.data?.message || 'Status update failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [projects, currentProject])

  const deleteProject = useCallback(async (projectId) => {
    setLoading(true)
    setError(null)
    try {
      await projectAPI.deleteProject(projectId)
      setProjects(projects.filter(p => p._id !== projectId))
      if (currentProject?._id === projectId) {
        setCurrentProject(null)
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Delete failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [projects, currentProject])

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      loading,
      error,
      fetchMyProjects,
      fetchProjectById,
      uploadProject,
      updateProjectStatus,
      deleteProject,
    }}>
      {children}
    </ProjectContext.Provider>
  )
}
