import { Maybe } from 'tsmonad'
import { Homepage, User, Workout } from '../types'

export enum ActionType {}

export enum ActionType {
  GOT_TOKENS,
  UPDATED_HOMEPAGE,
  LOADED_FAVORITE_WORKOUTS,
  LOADED_USERDATA,
  LOGOUT,
  SELECTED_WORKOUT,
}

export interface Action {
  type: ActionType
}

export interface LoadedHomepageAction extends Action {
  homepage: Maybe<Homepage>
}

export interface SelectedWorkoutAction extends Action {
  workout: Maybe<Workout>
}

export interface GotTokensAction extends Action{
  access: string
  refresh: string
}

export interface LoadedUserDataAction extends Action{
  user: Maybe<User>
}

export interface LoadedWorkoutsAction extends Action{
  workouts: Maybe<Workout[]>
}