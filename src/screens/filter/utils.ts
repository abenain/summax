import { getTitleForDuration } from '../../components/duration-filters'
import { getTitleForIntensity } from '../../components/intensity-filters'
import { getTitleForTarget } from '../../components/target-filters'
import { IntensityLevel, Target, WorkoutDuration } from '../../types'

export function getTitleForFilter(filterType: string, filterValue: string | number) {
  switch (filterType) {
    case 'duration':
      return getTitleForDuration(Number(filterValue) as WorkoutDuration)
    case 'intensity':
      return getTitleForIntensity(Number(filterValue) as IntensityLevel)
    case 'target':
      return getTitleForTarget(filterValue as Target)
    default:
      return ''
  }
}