import { combineReducers, createStore } from 'redux'
import contents, { Contents } from './reducers/contents'
import uiState, { UiState } from './reducers/uiState'
import userData, { UserData } from './reducers/userData'

const appReducer = combineReducers({
  contents,
  uiState,
  userData,
})

const store = createStore(appReducer)

export interface GlobalState {
  contents: Contents
  uiState: UiState
  userData: UserData
}

export function getStore() {
  return store
}
