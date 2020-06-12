import { Maybe } from 'tsmonad'
import { Homepage } from '../../types'
import { Action, ActionType, LoadedHomepageAction } from '../actions'

export interface Contents {
  homepage: Maybe<Homepage>
}

const initialState = {
  homepage: Maybe.nothing(),
}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case ActionType.LOADED_HOMEPAGE:
      const {homepage} = action as LoadedHomepageAction
      return {
        ...state,
        homepage
      }
    default:
      return state
  }
}