import { Maybe } from 'tsmonad'
import { Homepage, Workout } from '../types'
import { ApiVersion, checkFetchResponseIsOKOrThrow, getApiBaseUrl, getAuthorizationHeaders } from './utils'


export function load({ token }: { token: string }) {
  return fetch(`${getApiBaseUrl(ApiVersion.V2)}/homepage`, {
    headers: {
      ...getAuthorizationHeaders(token)
    }
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then(({ homepage, workouts }: { homepage: Homepage, workouts: Workout[] }) => {
      return Maybe.maybe<{ homepage: Homepage, workouts: Workout[] }>({ homepage, workouts })
    })
}