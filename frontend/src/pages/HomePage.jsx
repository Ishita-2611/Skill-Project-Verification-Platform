import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {/* Navigation */}
      <nav className="bg-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-2xl font-bold">TrustChain</span>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="hover:bg-blue-600 px-3 py-2 rounded transition"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition"
                  >
                    Profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="hover:bg-blue-600 px-3 py-2 rounded transition"
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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Welcome to TrustChain</h1>
          <p className="text-xl text-blue-100 mb-8">
            Decentralized skill project verification and peer review platform
          </p>
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/register')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition"
            >
              Get Started Now
            </button>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-xl font-bold mb-2">Upload Projects</h3>
            <p className="text-blue-100">Share your skill projects with the community and get them verified</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-xl font-bold mb-2">Peer Reviews</h3>
            <p className="text-blue-100">Receive detailed feedback from other professionals in your field</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold mb-2">Blockchain Verified</h3>
            <p className="text-blue-100">All verifications are recorded on the blockchain for transparency</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-white rounded-lg shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join TrustChain today and start sharing your skills with the world
          </p>
          {!isAuthenticated && (
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
