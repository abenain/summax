import { Maybe } from 'tsmonad'
import { Homepage } from '../types'

export enum ActionType {}

export enum ActionType {
  LOADED_HOMEPAGE
}

export interface Action {
  type: ActionType
}

export interface LoadedHomepageAction extends Action{
  homepage: Maybe<Homepage>
}