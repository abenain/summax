import { ImageSourcePropType } from 'react-native'

export interface User {
  firstname: string
}

export enum IntensityLevel {
  LOW,
  MEDIUM,
  HIGH
}

export enum WorkoutDuration {
  SHORT,
  MEDIUM,
  LONG
}

export interface HomePageWorkout {
  durationMin: number
  id: string
  intensity: IntensityLevel
  poster: ImageSourcePropType
  subtitle?: string
  title: string
}

export enum ExerciseModality {
  REPETITIONS,
  TIME,
}

export interface Exercise {
  duration: number
  modality: ExerciseModality
  thumbnailImage: ImageSourcePropType
  title: string
  videoUrl: string
}

export interface Workout {
  backgroundImage?: ImageSourcePropType
  description: string
  details: string
  durationMin: number
  exercises: Exercise[]
  id: string
  intensity: IntensityLevel
  target: Target
  techniques: string[]
  thumbnailImage?: ImageSourcePropType
  title: string
}

export enum Target {
  UPPER_BODY,
  LOWER_BODY,
  CORE,
  WHOLE_BODY,
}

export interface Homepage {
  featuredWorkout: HomePageWorkout
  selectedForYou: HomePageWorkout
  thematicWorkouts: HomePageWorkout[]
  popularWorkouts: HomePageWorkout[]
}