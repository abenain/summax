import { ImageSourcePropType } from 'react-native'

export interface User {
  firstname: string
}

export enum IntensityLevel {
  LOW,
  MEDIUM,
  HIGH
}

export interface Workout {
  durationMin: number
  id: string
  intensity: IntensityLevel
  poster: ImageSourcePropType
  subtitle: string
  title: string
}

export enum Target {
  UPPER_BODY,
  LOWER_BODY,
  CORE,
  WHOLE_BODY,
}