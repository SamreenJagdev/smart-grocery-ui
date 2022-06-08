import React from 'react'
import { AuthorizationCodeCallback } from 'react-oauth2-auth-code-flow'
import ClientOAuth2 from 'client-oauth2'
import { useNavigate } from 'react-router-dom'
import AuthService from '../services/auth.service'
import { AuthContext } from '../services/useAuthHelper'
import CircularProgress from '@mui/material/CircularProgress'
import UtilService from '../services/utils.service'

const oauthClient = new ClientOAuth2({
  clientId: `${UtilService.getIdpSettings().clientId}`,
  clientSecret: '',
  accessTokenUri: `${UtilService.getIdpSettings().baseUrl}/realms/smart-grocery/protocol/openid-connect/token`,
  authorizationUri: `${UtilService.getIdpSettings().baseUrl}/realms/smart-grocery/protocol/openid-connect/auth`,
  redirectUri: `${UtilService.getIdpSettings().redirectUri}/login`,
  scopes: ['openid']
})

const OAuthLogin = () => {
  const { setAuthenticated } = React.useContext(AuthContext)

  let navigate = useNavigate()

  async function handleSuccess(accessToken) {
    await AuthService.login(accessToken.data)
    setAuthenticated(true)
    navigate(`/dashboard`)
  }

  async function handleError(error) {
    console.error('An error occurred')
    console.error(error.message)
  }

  return (
    <AuthorizationCodeCallback
      oauthClient={oauthClient}
      onAuthSuccess={handleSuccess}
      onAuthError={handleError}
      render={({ processing, error }) => (
        <div>
          {processing && <CircularProgress size={100} />}
          {error && <p className='error'>An error occurred: {error.message}</p>}
        </div>
      )}
    />
  )
}

export default OAuthLogin
