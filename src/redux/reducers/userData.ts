import moment from 'moment'
import { Maybe } from 'tsmonad'
import { Sex, User } from '../../types'
import { Action, ActionType, GotTokensAction } from '../actions'

export interface UserData {
  accessToken: Maybe<string>
  refreshToken: Maybe<string>
  user: Maybe<User>
}

const initialState = {
  accessToken : Maybe.nothing(),
  refreshToken: Maybe.nothing(),
  user        : Maybe.just({
    firstname: 'Tacko',
    lastname : 'Fall',
    email    : 'tacko@celtics.com',
    dob      : moment('12/03/1999', 'DD/MM/YYYY').toDate(),
    heightCm : 220,
    weightKg : 125,
    sex      : Sex.MALE
  }),
}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case ActionType.GOT_TOKENS:
      const {access, refresh} = action as GotTokensAction
      return {
        ...state,
        accessToken: Maybe.maybe(access),
        refreshToken: Maybe.maybe(refresh)
      }
    default:
      return state
  }
}