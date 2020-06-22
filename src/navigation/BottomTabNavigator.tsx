import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as React from 'react'
import { MyWorkoutsScreen } from '../screens/my-workouts'
import { HomeStackNavigator } from './HomeStackNavigator'

const Tab = createBottomTabNavigator()

export function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStackNavigator}/>
      <Tab.Screen name="MyWorkouts" component={MyWorkoutsScreen}/>
    </Tab.Navigator>
  )
}
