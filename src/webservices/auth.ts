import { Maybe } from 'tsmonad'
import { checkFetchResponseIsOKOrThrow, getBackendUrl, getClientIdHeader, getJsonPayloadHeaders } from './utils'

export interface Tokens {
  access: string
  refresh: string
}

export function authenticate(email: string, plainTextPassword: string) {
  return fetch(`${getBackendUrl()}/auth/local`, {
    method : 'POST',
    headers: {
      ...getClientIdHeader(),
      ...getJsonPayloadHeaders()
    },
    body   : JSON.stringify({ email, password: plainTextPassword })
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then((tokens: Tokens) => Maybe.maybe(tokens))
    .catch(error => {
      console.log(error)
      return Maybe.nothing<Tokens>()
    })
}

export function fetchTokensFromRefreshToken(refreshToken: string) {
  return fetch(`${getBackendUrl()}/auth/local/refresh`, {
    method : 'POST',
    headers: {
      ...getClientIdHeader(),
      ...getJsonPayloadHeaders()
    },
    body   : JSON.stringify({ token: refreshToken })
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then((tokens: Tokens) => Maybe.maybe(tokens))
    .catch(error => {
      console.log(error)
      return Maybe.nothing<Tokens>()
    })
}