import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as React from 'react'
import { SummaxColors } from '../colors'
import { MyWorkoutsScreen } from '../screens/my-workouts'
import { Image } from 'react-native'
import { HomeStackNavigator } from './HomeStackNavigator'
import i18n from 'i18n-js'

const Tab = createBottomTabNavigator()
const homeLightIcon = require('./home-light.png')
const homeDarkIcon = require('./home-dark.png')
const trainingLightIcon = require('./training-light.png')
const trainingDarkIcon = require('./training-dark.png')

function getTabIcon(routeName: string, focused: boolean) {
  switch (routeName) {
    case 'MyWorkouts':
      return focused ? trainingDarkIcon : trainingLightIcon
    case 'Home':
    default:
      return focused ? homeDarkIcon : homeLightIcon
  }
}

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          return <Image source={getTabIcon(route.name, focused)} style={{ height: size }} resizeMode={'contain'}/>
        },
      })}
      tabBarOptions={{
        activeTintColor  : 'black',
        inactiveTintColor: SummaxColors.darkerGrey,
        labelStyle       : {
          fontFamily: 'nexaXBold',
          fontSize  : 12,
          lineHeight: 16,
        }
      }}
    >
      <Tab.Screen name="Home" options={{tabBarLabel: i18n.t('Tab bar - Home')}} component={HomeStackNavigator}/>
      <Tab.Screen name="MyWorkouts" options={{tabBarLabel: i18n.t('Tab bar - MyWorkouts')}} component={MyWorkoutsScreen}/>
    </Tab.Navigator>
  )
}
