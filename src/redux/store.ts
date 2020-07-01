import { combineReducers, createStore } from 'redux'
import { createMonadTransform } from './persistTransforms'
import contents, { Contents } from './reducers/contents'
import uiState, { UiState } from './reducers/uiState'
import userData, { UserData } from './reducers/userData'
import { persistReducer, persistStore } from 'redux-persist'
import { AsyncStorage } from 'react-native'

const persistedUserDataReducer = persistReducer({
  key       : '@summax/userData',
  storage   : AsyncStorage,
  transforms: [createMonadTransform(['accessToken', 'refreshToken', 'user'])]
}, userData)

const appReducer = combineReducers({
  contents,
  uiState,
  userData: persistedUserDataReducer,
})

const store = createStore(appReducer)

export interface GlobalState {
  contents: Contents
  uiState: UiState
  userData: UserData
}

let persistor
const storeHydrationPromise = new Promise(resolve => {
  persistor = persistStore(store, null, resolve)
})

export function getStore() {
  return store
}

export function getPersistor() {
  return persistor
}

export function getHydrationPromise() {
  return storeHydrationPromise
}
