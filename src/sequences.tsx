import { Maybe } from 'tsmonad'
import { ActionType } from './redux/actions'
import { getStore } from './redux/store'
import { Homepage, Workout } from './types'
import { callAuthenticatedWebservice } from './webservices'
import * as HomepageServices from './webservices/homepage'
import * as User from './webservices/user'

const store = getStore()

export function fetchHomepageSequence(freshToken?: string) {
  return callAuthenticatedWebservice(HomepageServices.load, {}, freshToken)
    .then((data: Maybe<{ homepage: Homepage, workouts: Workout[] }>) => {
      store.dispatch({
        type    : ActionType.UPDATED_HOMEPAGE,
        homepage: data.map(({ homepage }) => homepage),
      })
      store.dispatch({
        type    : ActionType.UPDATE_WORKOUT_CATALOG,
        workouts: data.map(({ workouts }) => workouts),
      })
    })
}

export function fetchUserDataSequence(freshToken?: string) {
  return callAuthenticatedWebservice(User.fetchMe, {}, freshToken)
    .then(user => {
      store.dispatch({
        type: ActionType.LOADED_USERDATA,
        user
      })
    })
}