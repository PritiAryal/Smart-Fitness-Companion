import { 
  Box, 
  Button, 
  AppBar, 
  Toolbar, 
  Typography, 
  Avatar, 
  IconButton,
  Container,
  Fade
} from '@mui/material'
import { Logout, Dashboard, FitnessCenter } from '@mui/icons-material'
import './App.css'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useDispatch } from 'react-redux'
import { setCredentials } from './store/authSlice.js'
import ActivityForm from './component/ActivityForm.jsx'
import ActivityList from './component/ActivityList.jsx'
import ActivityDetail from './component/ActivityDetail.jsx'

const ActivityPage = () => {
  return (
    <Box sx={{ 
      // minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      pt: 1,
      pb: 6
    }}>
      <Container maxWidth="lg">
        {/* Welcome Header */}
        <Fade in={true} timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 4, color: 'white' }}>
            {/* <Typography variant="h3" fontWeight="bold" gutterBottom>
              Smart Fitness Dashboard
            </Typography> */}
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Track your activities and get AI-powered insights
            </Typography>
          </Box>
        </Fade>

        {/* Activity Form */}
        <Fade in={true} timeout={1000}>
          <Box sx={{ mb: 4 }}>
            <ActivityForm onActivityAdded={() => window.location.reload()} />
          </Box>
        </Fade>

        {/* Activity List */}
        <Fade in={true} timeout={1200}>
          <Box>
            <ActivityList />
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({token, user: tokenData}));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  // Modern Login Page
  const LoginPage = () => (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{
        textAlign: 'center',
        color: 'white',
        p: 4
      }}>
        <FitnessCenter sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          Smart Fitness Companion
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Your personal AI-powered fitness tracker
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => {
            console.log('Login button clicked'); // Debug log
            console.log('AuthContext logIn function:', logIn); // Debug log
            logIn();
          }}
          sx={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            '&:hover': {
              background: 'rgba(255,255,255,0.3)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          Login with Keycloak
        </Button>
        {/* <Button variant="contained" color="secondary" onClick={logOut} sx={{ mt: 2 }}>
          Logout
        </Button> */}
      </Box>
    </Box>
  );

  // Navigation Bar Component
  const NavigationBar = () => (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar>
        <FitnessCenter sx={{ mr: 2, color: '#667eea' }} />
        <Typography variant="h6" component="div" sx={{ color: '#333', fontWeight: 'bold' }}>
          Smart Fitness Companion
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              fontSize: '0.9rem'
            }}
          >
            {tokenData?.name?.charAt(0) || 'U'}
          </Avatar>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {tokenData?.name || 'User'}
          </Typography>
          <IconButton 
            onClick={logOut}
            sx={{ 
              color: '#667eea',
              '&:hover': { background: 'rgba(102, 126, 234, 0.1)' }
            }}
          >
            <Logout />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );


  return (
    <Router>
      {!token ? (
        <LoginPage />
      ) : (
        <Box sx={{ minHeight: '100vh', background: '#f8f9fa' }}>
          <NavigationBar />
          <Routes>
            <Route path='/activities' element={<ActivityPage />} />
            <Route path='/activities/:id' element={<ActivityDetail />} />
            <Route path='/' element={<Navigate to="/activities" replace />} />
          </Routes>
        </Box>
      )}
    </Router>
  );
}

export default App
