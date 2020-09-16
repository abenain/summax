import { Maybe } from 'tsmonad'
import { Homepage, Workout } from '../../types'
import { Action, ActionType, LoadedHomepageAction, LoadedWorkoutsAction, UpdateWorkoutCatalogAction } from '../actions'

export interface Contents {
  favoriteWorkouts: Maybe<Workout[]>
  homepage: Maybe<Homepage>
  workoutCatalog: { [workoutId: string]: Workout }
}

const initialState = {
  favoriteWorkouts: Maybe.nothing(),
  homepage        : Maybe.nothing(),
  workoutCatalog  : {}
}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case ActionType.LOADED_FAVORITE_WORKOUTS:
      const { workouts: favoriteWorkouts } = action as LoadedWorkoutsAction
      return {
        ...state,
        favoriteWorkouts,
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