import { Maybe } from 'tsmonad'
import { Workout } from '../../types'
import { Action, ActionType, SelectedWorkoutAction } from '../actions'

export interface UiState {
  selectedWorkout: Maybe<Workout>
}

const initialState = {
  selectedWorkout: Maybe.nothing<Workout>(),
}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case ActionType.SELECTED_WORKOUT:
      const { workout: selectedWorkout } = action as SelectedWorkoutAction
      return {
        ...state,
        selectedWorkout
      }
    default:
      return state
  }
}