import { Maybe } from 'tsmonad'
import { checkFetchResponseIsOKOrThrow, getBackendUrl } from './index'

export function load(workoutId: string) {
  return fetch(`${getBackendUrl()}/workouts/${workoutId}`)
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then(workout => Maybe.maybe(workout))
    .catch(error => {
      console.log(error)
      return Maybe.nothing()
    })
}