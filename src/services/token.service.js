class TokenService {
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?.refresh_token
  }
  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?.access_token
  }
  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem('user'))
    user.access_token = token
    localStorage.setItem('user', JSON.stringify(user))
  }
  getUser() {
    return JSON.parse(localStorage.getItem('user'))
  }
  setUser(user) {
    console.log('Setting user in localStorage')
    localStorage.setItem('user', JSON.stringify(user))
  }
  removeUser() {
    localStorage.removeItem('user')
  }
  getUserInfo() {
    return JSON.parse(localStorage.getItem('userInfo'))
  }
  setUserInfo(userInfo) {
    console.log('Setting userInfo in localStorage')
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  }
  removeUserInfo() {
    localStorage.removeItem('userInfo')
  }
}
export default new TokenService()
