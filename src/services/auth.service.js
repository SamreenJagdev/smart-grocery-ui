import TokenService from './token.service'
import api from './api.service'
import UtilService from './utils.service'

const login = async (accessToken) => {
  if (accessToken) {
    TokenService.setUser(accessToken)
    const response = await api.post(`${UtilService.getIdpSettings().baseUrl}/realms/smart-grocery/protocol/openid-connect/userinfo`)
    let userInfo = await response.data

    TokenService.setUserInfo(userInfo)
  }
}
const logout = (redirect_uri) => {
  TokenService.removeUserInfo()
  TokenService.removeUser()
  window.location.assign(redirect_uri)
}
const AuthService = {
  login,
  logout
}
export default AuthService
