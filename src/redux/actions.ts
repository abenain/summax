import { Maybe } from 'tsmonad'
import { Homepage, Workout } from '../types'

export enum ActionType {}

export enum ActionType {
  GOT_TOKENS,
  LOADED_HOMEPAGE,
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