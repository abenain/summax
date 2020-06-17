import { Maybe } from 'tsmonad'
import { checkFetchResponseIsOKOrThrow, getBackendUrl } from './index'

const defaultPoster = require('../../assets/login_background.png')

export function load() {
  return fetch(`${getBackendUrl()}/homepage`)
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then(homepage => {
      return Maybe.maybe({
        featuredWorkout : {
          ...homepage.featuredWorkout,
          poster: defaultPoster
        },
        selectedForYou  : {
          ...homepage.selectedForYou,
          poster: defaultPoster
        },
        thematicWorkouts: homepage.thematicWorkouts.map(workout => ({
          ...workout,
          poster: defaultPoster
        })),
        popularWorkouts : homepage.popularWorkouts.map(workout => ({
          ...workout,
          poster: defaultPoster
        })),
      })
    })
    .catch(error => {
      console.log(error)
      return Maybe.nothing()
    })
}