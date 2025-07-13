import { Button } from '@mui/material'
import './App.css'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useDispatch } from 'react-redux'
import { setCredentials } from './store/authSlice.js'


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


  return (
    <>
      <Router>
        <Button variant="contained" color="#1976d2">Contained</Button>
      </Router>
      
    </>
  )
}

export default App
