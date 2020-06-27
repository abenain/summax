import { ActionType } from './redux/actions'
import { getStore } from './redux/store'
import * as Homepage from './webservices/homepage'

const store = getStore()

export function performLoadHomepageSequence({token}: {token: string}) {
  return Homepage.load({token})
    .then(homepage => {
      store.dispatch({
        type: ActionType.LOADED_HOMEPAGE,
        homepage,
      })
    })
}