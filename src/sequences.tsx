import { ActionType } from './redux/actions'
import { getStore } from './redux/store'
import { callAuthenticatedWebservice } from './webservices'
import * as Homepage from './webservices/homepage'
import * as User from './webservices/user'

const store = getStore()

export function fetchHomepageSequence(freshToken?: string) {
  return callAuthenticatedWebservice(Homepage.load, {}, freshToken)
    .then(homepage => {
      store.dispatch({
        type: ActionType.UPDATED_HOMEPAGE,
        homepage,
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