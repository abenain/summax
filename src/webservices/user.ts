import { Maybe } from 'tsmonad'
import { Tokens } from './auth'
import { checkFetchResponseIsOKOrThrow, getApiBaseUrl, getClientIdHeader, getJsonPayloadHeaders } from './index'

export function createUser(userData: { dob: Date, email: string, firstname: string, lastname: string, password: string }) {
  return fetch(`${getApiBaseUrl()}/users`, {
    method : 'POST',
    headers: {
      ...getClientIdHeader(),
      ...getJsonPayloadHeaders()
    },
    body   : JSON.stringify(userData)
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then(({ _id }: { _id: string }) => Maybe.maybe(_id))
    .catch(error => {
      console.log(error)
      return Maybe.nothing<string>()
    })
}

export function resendOtp(userId: string) {
  return fetch(`${getApiBaseUrl()}/users/${userId}/resend-otp`, {
    method : 'GET',
    headers: {
      ...getClientIdHeader(),
    },
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then(() => Maybe.just(true))
    .catch(error => {
      console.log(error)
      return Maybe.nothing<string>()
    })
}

export function checkOtp(userId: string, otp: string) {
  return fetch(`${getApiBaseUrl()}/users/${userId}/check-otp`, {
    method : 'PUT',
    headers: {
      ...getClientIdHeader(),
      ...getJsonPayloadHeaders()
    },
    body   : JSON.stringify({ otp })
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