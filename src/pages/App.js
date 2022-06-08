import * as React from 'react'
import Dashboard from './Dashboard'
import Home from './Home'
import ErrorPage from './ErrorPage'
import OAuthLogin from './OAuthLogin'
import theme from '../style/theme'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import '../style/App.css'
import { AuthProvider } from '../services/useAuthHelper'
import { BrowserRouter as Router } from 'react-router-dom'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/login' element={<OAuthLogin />} />
            <Route path='*' element={<ErrorPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}
