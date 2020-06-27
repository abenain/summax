import { ActionType } from './redux/actions'
import { getStore } from './redux/store'
import * as Homepage from './webservices/homepage'
import * as User from './webservices/user'

const store = getStore()

export function fetchHomepageSequence({token}: {token: string}) {
  return Homepage.load({token})
    .then(homepage => {
      store.dispatch({
        type: ActionType.LOADED_HOMEPAGE,
        homepage,
      })
    })
}

export function fetchUserDataSequence({token}: {token: string}) {
  return User.fetchMe({token})
    .then(user => {
      store.dispatch({
        type: ActionType.LOADED_USERDATA,
        user
      })
    })
}