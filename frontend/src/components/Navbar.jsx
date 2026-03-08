import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80"
            onClick={() => navigate('/')}
          >
            <span className="text-2xl font-bold">TrustChain</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-6">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="hover:bg-blue-700 px-3 py-2 rounded transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/projects')}
                  className="hover:bg-blue-700 px-3 py-2 rounded transition"
                >
                  My Projects
                </button>
                <button
                  onClick={() => navigate('/verify')}
                  className="hover:bg-blue-700 px-3 py-2 rounded transition"
                >
                  Verify Projects
                </button>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm">{user?.username}</span>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded transition text-sm"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="hover:bg-blue-700 px-3 py-2 rounded transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
