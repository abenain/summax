import { Maybe } from 'tsmonad'
import { Homepage, Workout } from '../../types'
import {
  Action,
  ActionType,
  LoadedHomepageAction,
  SetWorkoutFavoriteStatusAction,
  UpdateWorkoutCatalogAction
} from '../actions'

export interface Contents {
  homepage: Maybe<Homepage>
  workoutCatalog: { [workoutId: string]: Workout }
}

const initialState = {
  homepage        : Maybe.nothing(),
  workoutCatalog  : {}
}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case ActionType.SET_WORKOUT_FAVORITE_STATUS:
      const {favorite, workoutId} = action as SetWorkoutFavoriteStatusAction
      return {
        ...state,
        workoutCatalog: {
          ...state.workoutCatalog,
          [workoutId]: {
            ...state.workoutCatalog[workoutId],
            favorite
          }
        },
      }
    case ActionType.UPDATED_HOMEPAGE:
      const { homepage } = action as LoadedHomepageAction
      return {
        ...state,
        homepage
      }
    case ActionType.UPDATE_WORKOUT_CATALOG:
      const { workouts } = action as UpdateWorkoutCatalogAction
      return {
        ...state,
        workoutCatalog: {
          ...state.workoutCatalog,
          ...workouts.caseOf({
            just   : workoutTable => workoutTable.reduce((accumulator, workout) => ({
              ...accumulator,
              [workout.id]: workout,
            }), {}),
            nothing: () => ({})
          }),
        }
      }
    default:
      return state
  }
}