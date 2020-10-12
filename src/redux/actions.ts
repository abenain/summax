import { Maybe } from 'tsmonad'
import { Homepage, User, Workout } from '../types'

export enum ActionType {}

export enum ActionType {
  GOT_TOKENS,
  UPDATED_HOMEPAGE,
  LOADED_USERDATA,
  LOGOUT,
  SELECTED_WORKOUT,
  SET_WORKOUT_FAVORITE_STATUS,
  UPDATE_WORKOUT_CATALOG,
}

export interface Action {
  type: ActionType
}

export interface LoadedHomepageAction extends Action {
  homepage: Maybe<Homepage>
}

export interface UpdateWorkoutCatalogAction extends Action {
  workouts: Maybe<Workout[]>
}

export interface SelectedWorkoutAction extends Action {
  workoutId: Maybe<string>
}

export interface GotTokensAction extends Action {
  access: string
  refresh: string
}

export interface LoadedUserDataAction extends Action {
  user: Maybe<User>
}

export interface SetWorkoutFavoriteStatusAction extends Action {
  favorite: boolean
  workoutId: string
}