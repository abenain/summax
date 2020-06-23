import moment from 'moment'
import { Maybe } from 'tsmonad'
import { Sex, User } from '../../types'
import { Action } from '../actions'

export interface UserData {
  user: Maybe<User>
}

const initialState = {
  user: Maybe.just({
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
    default:
      return state
  }
}