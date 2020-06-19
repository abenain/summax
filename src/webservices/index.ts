import Constants from 'expo-constants'

const SCHEME_HTTP = 'http'
const BACKEND_URL_DEV = '192.168.1.18:18000'
const BACKEND_URL_PROD = '18.158.0.93'

export function getBackendUrl(){
  const {releaseChannel} = Constants.manifest

  if (Boolean(releaseChannel) === false){
    return `${SCHEME_HTTP}://${BACKEND_URL_DEV}`
  }

  if (releaseChannel.indexOf('prod') !== -1){
    return `${SCHEME_HTTP}://${BACKEND_URL_PROD}`
  }

  if (releaseChannel.indexOf('staging') !== -1){
    return `${SCHEME_HTTP}://${BACKEND_URL_PROD}`
  }

  return `${SCHEME_HTTP}://${BACKEND_URL_DEV}`
}

export function checkFetchResponseIsOKOrThrow(response: Response) {
  if (response.status !== 200) {
    return response.json().then(({ text, error_description }) => {
      throw {
        error : new Error(text || error_description),
        status: response.status,
      }
    })
  }

  return Promise.resolve()
}