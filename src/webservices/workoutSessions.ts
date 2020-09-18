import qs from 'qs'
import { Maybe } from 'tsmonad'
import { StatisticsData } from '../types'
import { ApiVersion, checkFetchResponseIsOKOrThrow, getApiBaseUrl, getAuthorizationHeaders } from './utils'

export function loadStatistics({ token }: { token: string }): Promise<Maybe<StatisticsData>> {
  return fetch(`${getApiBaseUrl(ApiVersion.V2)}/workouts/sessions/statistics`, {
    headers: {
      ...getAuthorizationHeaders(token)
    }
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then(statistics => Maybe.maybe(statistics))
}

export function getOrCreateSession({ token, totalExerciseCount = 0, workoutId }: { token: string, totalExerciseCount: number, workoutId: string }) {
  const queryParams = workoutId ? `?${qs.stringify({
      totalExerciseCount,
      workoutId,
    })}` : ''
  return fetch(`${getApiBaseUrl(ApiVersion.V2)}/workouts/sessions${queryParams}`, {
    headers: {
      ...getAuthorizationHeaders(token)
    }
  })
    .then(async response => {
      await checkFetchResponseIsOKOrThrow(response)
      return response.json()
    })
    .then(session => Maybe.maybe(session))
}