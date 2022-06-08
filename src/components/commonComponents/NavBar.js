import * as React from 'react'
import Typography from '@mui/material/Typography'
import MuiAppBar from '@mui/material/AppBar'
import MuiToolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
/* eslint-disable no-unused-vars */
import { BrowserRouter as Router, Route, Link, useNavigate } from 'react-router-dom'
/* eslint-enable no-unused-vars */
import '../../style/App.css'
import { RequestAuthorizationCode } from 'react-oauth2-auth-code-flow'
import ClientOAuth2 from 'client-oauth2'
import Button from '@mui/material/Button'
import AuthService from '../../services/auth.service'
import UtilService from '../../services/utils.service'

const oauthClient = new ClientOAuth2({
  clientId: `${UtilService.getIdpSettings().clientId}`,
  clientSecret: '',
  accessTokenUri: `${UtilService.getIdpSettings().baseUrl}/realms/smart-grocery/protocol/openid-connect/token`,
  authorizationUri: `${UtilService.getIdpSettings().baseUrl}/realms/smart-grocery/protocol/openid-connect/auth`,
  redirectUri: `${UtilService.getIdpSettings().redirectUri}/login`,
  scopes: ['openid']
})

const rightLink = {
  fontSize: 16,
  ml: 3
}

const signOutAction = () => {
  AuthService.logout(
    `${UtilService.getIdpSettings().baseUrl}/realms/smart-grocery/protocol/openid-connect/logout?redirect_uri=${encodeURI(
      UtilService.getIdpSettings().redirectUri
    )}`
  )
}

const NavBar = (props) => {
  return (
    <div className='AppBarDiv'>
      <MuiAppBar elevation={0} position='fixed' sx={{ height: '70px', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <MuiToolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h4'>Smart Grocery</Typography>

          <Box sx={{ flex: 1 }}>
            {props.isLoggedIn === 'true' ? (
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='contained' color='secondary' onClick={signOutAction}>
                  {'Sign Out'}
                </Button>
              </Box>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <RequestAuthorizationCode
                  oauthClient={oauthClient}
                  state={{ from: '/home' }}
                  render={({ url }) => (
                    <Button variant='contained' color='secondary' sx={rightLink} href={url}>
                      {'Login / Sign Up'}
                    </Button>
                  )}
                />
              </Box>
            )}
          </Box>
        </MuiToolbar>
      </MuiAppBar>
    </div>
  )
}

export default NavBar
