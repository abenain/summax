export interface WebserviceError {
  status: number
}

export enum Sex {
  FEMALE = 'female',
  MALE = 'male',
}

export enum Objectives {
  ATHLETE = 'athlete',
  BALANCE = 'balance',
  MUSCLE = 'muscle',
  SHAPE = 'shape',
  WEIGHT = 'weight',
}

export interface User {
  _id: string
  dob: Date
  email: string
  favoriteWorkouts: string[]
  firstname: string
  heightCm?: number
  lastname: string
  objectives: Objectives[]
  onboarded: boolean
  sex?: Sex
  weightKg?: number
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

export enum ExerciseModality {
  REPETITIONS,
  TIME,
}

export interface Exercise {
  duration: number
  modality: ExerciseModality
  title: string
  mediaId: string
}

export interface Workout {
  backgroundPosterUrl: string
  description: string
  details: string
  durationMin: number
  exercises: Exercise[]
  favorite: boolean
  id: string
  intensity: IntensityLevel
  posterUrl: string
  target: Target
  techniques: string[]
  title: string
}

export interface Theme {
  posterUrl: string
  title: string
  workoutIds: string[]
}

export enum Target {
  UPPER_BODY,
  LOWER_BODY,
  CORE,
  WHOLE_BODY,
}

export interface Homepage {
  featuredWorkout: {
    id: string
    posterUrl: string
  }
  selectedForYou: {
    id: string
  }
  themes: Theme[]
  popularWorkouts: { id: string }[]
}

export interface WorkoutSession {
  _id: string
  doneExerciseCount : number
  finished          : boolean
  timeSpentMs       : number
  totalExerciseCount: number
  workoutId         : string
}

export interface StatisticsData {
  oldestSessionCreationDate: Date
  sessionCount: number
  timeSpentMs: number
  unfinishedSessions: WorkoutSession[]
}