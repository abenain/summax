import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { GlobalState } from '../redux/store'
import { Workout, WorkoutPlan } from '../types'
import { isPremium } from '../utils'

export function useNavigateToWorkout() {
  const navigation = useNavigation()
  const { subscriptionPeriodEnd } = useSelector(({ userData: { user } }: GlobalState) => user.valueOr({} as any))

  const userIsPremium = useCallback(() => {
    return isPremium(subscriptionPeriodEnd)
  }, [subscriptionPeriodEnd])

  return function(workout: Workout){
    if(workout.plan === WorkoutPlan.PREMIUM && userIsPremium() === false){
      return navigation.navigate('Subscription')
    }

    navigation.navigate('Workout', { id: workout.id, title: workout.title })
  }
}