import { Maybe } from 'tsmonad'
import { User } from '../../types'
import { Action, ActionType, GotTokensAction, LoadedUserDataAction } from '../actions'

export interface UserData {
  accessToken: Maybe<string>
  refreshToken: Maybe<string>
  user: Maybe<User>
}

const initialState = {
  accessToken : Maybe.nothing<string>(),
  refreshToken: Maybe.nothing<string>(),
  user        : Maybe.nothing<User>(),
}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case ActionType.GOT_TOKENS:
      const { access, refresh } = action as GotTokensAction
      return {
        ...state,
        accessToken : Maybe.maybe(access),
        refreshToken: Maybe.maybe(refresh)
      }
    case ActionType.LOADED_USERDATA:
      const { user } = action as LoadedUserDataAction
      return {
        ...state,
        user
      }
    default:
      return state
  }
}