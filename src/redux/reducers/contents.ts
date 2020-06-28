import { Maybe } from 'tsmonad'
import { Homepage, Workout } from '../../types'
import { Action, ActionType, LoadedHomepageAction, LoadedWorkoutsAction } from '../actions'

export interface Contents {
  favoriteWorkouts: Maybe<Workout[]>
  homepage: Maybe<Homepage>
}

const initialState = {
  favoriteWorkouts: Maybe.nothing(),
  homepage        : Maybe.nothing(),
}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case ActionType.LOADED_FAVORITE_WORKOUTS:
      const { workouts } = action as LoadedWorkoutsAction
      return {
        ...state,
        favoriteWorkouts: workouts,
      }
    case ActionType.UPDATED_HOMEPAGE:
      const { homepage } = action as LoadedHomepageAction
      return {
        ...state,
        homepage
      }
    default:
      return state
  }
}