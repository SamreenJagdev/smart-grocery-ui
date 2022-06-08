import axios from 'axios'
import qs from 'qs'
import TokenService from './token.service'
import UtilService from './utils.service'

const instance = axios.create({
  baseURL: 'http://localhost:30008/v1',
  headers: {}
})

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken()
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (res) => {
    return res
  },
  async (err) => {
    const originalConfig = err.config
    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true
        try {
          var data = qs.stringify({
            grant_type: 'refresh_token',
            client_id: `${UtilService.getIdpSettings().clientId}`,
            refresh_token: TokenService.getLocalRefreshToken()
          })

          var config = {
            method: 'post',
            url: `${UtilService.getIdpSettings().baseUrl}/realms/smart-grocery/protocol/openid-connect/token`,
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: data
          }

          const rs = await instance(config)
          TokenService.setUser(rs.data)
          return instance(originalConfig)
        } catch (_error) {
          return Promise.reject(_error)
        }
      }
    }
    return Promise.reject(err)
  }
)
export default instance
