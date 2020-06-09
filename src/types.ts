import { ImageSourcePropType } from 'react-native'

export interface User {
  firstname: string
}

export enum IntensityLevel {
  LOW,
  MEDIUM,
  HIGH
}

export enum Size {
  SMALL,
  LARGE,
}

export interface Workout {
  durationMin: number
  intensity: IntensityLevel
  poster: ImageSourcePropType
  subtitle: string
  title: string
}