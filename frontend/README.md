# Frontend - TrustChain Skill Verification Platform

A modern React 18 frontend for the TrustChain platform, built with Vite, TailwindCSS, and integrated with a Node.js/Express backend.

## Features

- 🔐 **User Authentication** - Secure registration and login with JWT
- 📤 **Project Upload** - Upload and manage your skill projects
- ✓ **Peer Verification** - Verify and review other projects
- 📊 **Dashboard** - View your profile, projects, and reputation score
- 🎨 **Modern UI** - Built with React and TailwindCSS
- ⚡ **Fast Development** - Powered by Vite

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.jsx     # Main layout wrapper
│   │   ├── Navbar.jsx     # Navigation bar
│   │   ├── PrivateRoute.jsx   # Protected routes
│   │   └── ...            # Other UI components
│   ├── pages/             # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── UploadProjectPage.jsx
│   │   ├── VerificationListPage.jsx
│   │   └── ...
│   ├── services/          # API integration
│   │   └── api.js         # Axios setup and API methods
│   ├── context/           # React Context for state management
│   │   ├── AuthContext.jsx
│   │   └── ProjectContext.jsx
│   ├── hooks/             # Custom hooks
│   │   ├── useAuth.js
│   │   └── useProjects.js
│   ├── css/               # Stylesheets
│   ├── App.jsx            # Main App component
│   └── main.jsx           # Entry point
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # TailwindCSS configuration
├── postcss.config.js      # PostCSS configuration
└── .env                   # Environment variables
```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Update `VITE_API_URL` to match your backend URL

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Available Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (require authentication)
- `/dashboard` - User dashboard
- `/profile` - User profile management
- `/projects` - View user's projects
- `/projects/upload` - Upload new project
- `/projects/:projectId` - Project details
- `/verify` - List projects to verify
- `/verify/:projectId` - Submit project verification

## API Integration

The frontend connects to the backend API endpoints:

```javascript
// Authentication
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
PUT /api/auth/profile

// Projects
POST /api/projects/upload
GET /api/projects/my-projects
GET /api/projects/:id
PUT /api/projects/:id/status
DELETE /api/projects/:id

// Verification
POST /api/verify/:projectId             ← submit verification for a project (protected)
GET /api/verify/:projectId              ← list all verifications for a project
GET /api/verify/available              ← list projects the current user can review (protected)
POST /api/verify/hash/:hash             ← verify hash on blockchain
GET /api/verify/stats/reviewer         ← reviewer-specific stats (protected)
GET /api/verify/stats/all              ← overall verification statistics
```

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Ethers.js** - Blockchain interaction
- **Context API** - State management

## Development

### Start Development Server
```bash
npm run dev
```

Server will run at `http://localhost:5173`

### Format Code
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

Output will be in the `dist/` directory

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token and user data
3. Token stored in localStorage
4. Token sent with every API request via Authorization header
5. If token expires (401), user is redirected to login

## State Management

The app uses React Context API for global state:

- **AuthContext** - User authentication and profile
- **ProjectContext** - Projects and verification data

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - see LICENSE file for details
