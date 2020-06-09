import { combineReducers, createStore } from 'redux'
import userData, { UserData } from './reducers/userData'

const appReducer = combineReducers({
  userData
})

const store = createStore(appReducer)

export interface GlobalState {
  userData: UserData
}

export function getStore() {
  return store
}
