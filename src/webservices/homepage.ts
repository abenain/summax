import { Maybe } from 'tsmonad'
import { Homepage } from '../types'
import { checkFetchResponseIsOKOrThrow, getApiBaseUrl, getAuthorizationHeaders } from './utils'

const defaultPoster = require('../../assets/login_background.png')

export function load({ token }: { token: string }) {
  return fetch(`${getApiBaseUrl()}/homepage`, {
    headers: {
      ...getAuthorizationHeaders(token)
    }
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then(homepage => {
      return Maybe.maybe<Homepage>({
        featuredWorkout: {
          ...homepage.featuredWorkout,
        },
        selectedForYou : {
          ...homepage.selectedForYou,
          poster: defaultPoster
        },
        themes         : homepage.themes.map(workout => ({
          ...workout,
          poster: defaultPoster
        })),
        popularWorkouts: homepage.popularWorkouts.map(workout => ({
          ...workout,
          poster: defaultPoster
        })),
      })
    })
}