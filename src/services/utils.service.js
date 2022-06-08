const idpSettings = {
  baseUrl: 'http://localhost:32133',
  clientId: 'smart-grocery',
  redirectUri: 'http://localhost:30007'
}

const getIdpSettings = () => {
  return idpSettings
}

const UtilService = {
  getIdpSettings
}

export default UtilService
