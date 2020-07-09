import { Maybe } from 'tsmonad'
import { checkFetchResponseIsOKOrThrow, getApiBaseUrl, getAuthorizationHeaders, getJsonPayloadHeaders } from './utils'

export function load({ token, workoutId }: { token: string, workoutId: string }) {
  return fetch(`${getApiBaseUrl()}/workouts/${workoutId}`, {
    headers: {
      ...getAuthorizationHeaders(token)
    }
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then(workout => Maybe.maybe(workout))
}

export function loadFavorites({ token }: { token: string, workoutId: string }) {
  return fetch(`${getApiBaseUrl()}/workouts/favorites`, {
    headers: {
      ...getAuthorizationHeaders(token)
    }
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then(workouts => Maybe.maybe(workouts))
}

export function addToFavorites({ token, workoutId }: { token: string, workoutId: string }) {
  return fetch(`${getApiBaseUrl()}/users/me/favorites`, {
    method : 'PUT',
    headers: {
      ...getAuthorizationHeaders(token),
      ...getJsonPayloadHeaders(),
    },
    body   : JSON.stringify({ workoutId })
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then(user => Maybe.maybe(user))
}

export function removeFromFavorites({ token, workoutId }: { token: string, workoutId: string }) {
  return fetch(`${getApiBaseUrl()}/users/me/favorites`, {
    method : 'DELETE',
    headers: {
      ...getAuthorizationHeaders(token),
      ...getJsonPayloadHeaders(),
    },
    body   : JSON.stringify({ workoutId })
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then(user => Maybe.maybe(user))
}

export function fetchWorkouts({ token, filter }: { token: string, filter?: {type: string, value: string} }) {
  const queryParams = filter ? `?${filter.type}=${filter.value}` : ''

  return fetch(`${getApiBaseUrl()}/workouts${queryParams}`, {
    method: 'GET',
    headers: {
      ...getAuthorizationHeaders(token),
    },
  }).then(async response => {
    await checkFetchResponseIsOKOrThrow(response)
    return response.json()
  })
    .then(workouts => Maybe.maybe(workouts))
}