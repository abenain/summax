import Constants from 'expo-constants'

const SCHEME_HTTP = 'http'
const BACKEND_URL_DEV = '192.168.1.36:18000'
const BACKEND_URL_PROD = '18.158.0.93'

const API_V1_PATH = 'api/v1'

const CLIENT_ID = 'ayhcwZdiy5rgWreq3wN6tA2hk2HC'

export function getBackendUrl() {
  const { releaseChannel } = Constants.manifest

  if (Boolean(releaseChannel) === false) {
    return `${SCHEME_HTTP}://${BACKEND_URL_DEV}`
  }

  if (releaseChannel.indexOf('prod') !== -1) {
    return `${SCHEME_HTTP}://${BACKEND_URL_PROD}`
  }

  if (releaseChannel.indexOf('staging') !== -1) {
    return `${SCHEME_HTTP}://${BACKEND_URL_PROD}`
  }

  return `${SCHEME_HTTP}://${BACKEND_URL_DEV}`
}

export function getApiBaseUrl() {
  return `${getBackendUrl()}/${API_V1_PATH}`
}

export function checkFetchResponseIsOKOrThrow(response: Response) {
  if (response.status !== 200 && response.status !== 201) {
    throw {
      status: response.status,
    }
  }

  return Promise.resolve()
}

export function getClientIdHeader() {
  return {
    'client-id': CLIENT_ID
  }
}

export function getJsonPayloadHeaders() {
  return {
    'Content-Type': 'application/json'
  }
}

export function getAuthorizationHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`
  }
}