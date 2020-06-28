import { Maybe } from 'tsmonad'
import { checkFetchResponseIsOKOrThrow, getApiBaseUrl, getAuthorizationHeaders, getJsonPayloadHeaders } from './utils'

const exercisePoster = require('../screens/training/exercise.png')

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
    .then(workout => ({
      ...workout,
      exercises: workout.exercises.map(exercise => ({ ...exercise, thumbnailImage: exercisePoster }))
    }))
    .then(workout => Maybe.maybe(workout))
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
    .then(workout => Maybe.maybe(workout))
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
    .then(workout => Maybe.maybe(workout))
}