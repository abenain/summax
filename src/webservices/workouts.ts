import { Maybe } from 'tsmonad'
import { checkFetchResponseIsOKOrThrow, getApiBaseUrl, getAuthorizationHeaders } from './utils'

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