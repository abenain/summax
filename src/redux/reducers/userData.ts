import { Maybe } from 'tsmonad'
import { User } from '../../types'
import { Action } from '../actions'

export interface UserData {
  user: Maybe<User>
}

const initialState = {
  user: Maybe.nothing(),
}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    default:
      return state
  }
}