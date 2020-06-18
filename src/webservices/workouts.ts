import { Maybe } from 'tsmonad'
import { checkFetchResponseIsOKOrThrow, getBackendUrl } from './index'

const exercisePoster = require('../screens/training/exercise.png')

export function load(workoutId: string) {
  return fetch(`${getBackendUrl()}/workouts/${workoutId}`)
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then(workout => ({
      ...workout,
      exercises: workout.exercises.map(exercise => ({...exercise, thumbnailImage: exercisePoster}))
    }))
    .then(workout => Maybe.maybe(workout))
    .catch(error => {
      console.log(error)
      return Maybe.nothing()
    })
}