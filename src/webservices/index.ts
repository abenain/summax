const SCHEME_HTTP = 'http'
const BACKEND_URL_DEV = '192.168.1.18:18000'

export function getBackendUrl(){
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