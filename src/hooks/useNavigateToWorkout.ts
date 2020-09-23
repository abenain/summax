import moment from 'moment'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { GlobalState } from '../redux/store'
import { Workout, WorkoutPlan } from '../types'
import { useNavigation } from '@react-navigation/native'

export function useNavigateToWorkout() {
  const navigation = useNavigation()
  const { subscriptionPeriodEnd } = useSelector(({ userData: { user } }: GlobalState) => user.valueOr({} as any))

  const isPremium = useCallback(() => {
    return Boolean(subscriptionPeriodEnd) && moment().isBefore(subscriptionPeriodEnd)
  }, [subscriptionPeriodEnd])

  return function(workout: Workout){
    if(workout.plan === WorkoutPlan.PREMIUM && isPremium() === false){
      return navigation.navigate('Subscription')
    }

    navigation.navigate('Workout', { id: workout.id, title: workout.title })
  }
}