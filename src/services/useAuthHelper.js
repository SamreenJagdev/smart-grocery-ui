import * as React from 'react'
import tokenService from './token.service'
import api from './api.service'
import UtilService from './utils.service'

export const AuthContext = React.createContext(null)

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = React.useState(false)
  const [authLoading, setAuthLoading] = React.useState(true)

  React.useEffect(() => {
    checkLogin()
  }, [])

  const checkLogin = async () => {
    const accessJwtoken = tokenService.getLocalAccessToken()
    setAuthLoading(true)

    if (accessJwtoken) {
      api
        .post(`${UtilService.getIdpSettings().baseUrl}/realms/smart-grocery/protocol/openid-connect/userinfo`)
        .then(() => {
          setAuthenticated(true)
          setAuthLoading(false)
        })
        .catch(() => {
          setAuthenticated(false)
          setAuthLoading(false)
        })
    } else {
      setAuthenticated(false)
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    setAuthenticated(false)
  }

  const stateValues = { authenticated, setAuthenticated, checkLogin, handleLogout, authLoading, setAuthLoading }

  return <AuthContext.Provider value={stateValues}>{children}</AuthContext.Provider>
}
