import { Maybe } from 'tsmonad'
import { User } from '../types'
import { Tokens } from './auth'
import {
  checkFetchResponseIsOKOrThrow,
  getApiBaseUrl,
  getAuthorizationHeaders,
  getClientIdHeader,
  getJsonPayloadHeaders
} from './utils'

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
    .then((user: User) => Maybe.maybe(user))
    .catch(error => {
      console.log(error)
      return Maybe.nothing<User>()
    })
}

export function sendOtp(email: string) {
  const queryParams = email ? `?email=${encodeURIComponent(email)}` : ''

  return fetch(`${getApiBaseUrl()}/users/send-otp${queryParams}`, {
    method : 'GET',
    headers: {
      ...getClientIdHeader(),
    },
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return Maybe.just(true)
    })
    .catch(error => {
      console.log(error)
      return Maybe.nothing<boolean>()
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

export function checkOtpByMail(email: string, otp: string) {
  const queryParams = (email && otp) ? `?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}` : ''
  return fetch(`${getApiBaseUrl()}/users/check-otp${queryParams}`, {
    method : 'GET',
    headers: {
      ...getClientIdHeader(),
    },
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

export function updateUser({ userData, token }: { userData: Partial<User>, token: string }) {
  return fetch(`${getApiBaseUrl()}/users/me`, {
    method : 'PUT',
    headers: {
      ...getAuthorizationHeaders(token),
      ...getJsonPayloadHeaders(),
    },
    body   : JSON.stringify(userData)
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then((user: User) => Maybe.maybe(user))
}

export function fetchMe({ token }: { token: string }) {
  return fetch(`${getApiBaseUrl()}/users/me`, {
    headers: {
      ...getAuthorizationHeaders(token),
    },
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then((user: User) => Maybe.maybe(user))

}