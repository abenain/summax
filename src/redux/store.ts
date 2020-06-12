import { combineReducers, createStore } from 'redux'
import userData, { UserData } from './reducers/userData'
import contents, { Contents } from './reducers/contents'

const appReducer = combineReducers({
  contents,
  userData,
})

const store = createStore(appReducer)

export interface GlobalState {
  contents: Contents
  userData: UserData
}

export function getStore() {
  return store
}
