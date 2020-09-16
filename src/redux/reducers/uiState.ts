import { Maybe } from 'tsmonad'
import { Action, ActionType, SelectedWorkoutAction } from '../actions'

export interface UiState {
  selectedWorkoutId: Maybe<string>
}

const initialState = {
  selectedWorkoutId: Maybe.nothing<string>(),
}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case ActionType.SELECTED_WORKOUT:
      const { workoutId: selectedWorkoutId } = action as SelectedWorkoutAction
      return {
        ...state,
        selectedWorkoutId
      }
    default:
      return state
  }
}