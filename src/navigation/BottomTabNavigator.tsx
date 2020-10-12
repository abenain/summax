import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, Platform } from 'react-native'
import { SummaxColors } from '../colors'
import { MyWorkoutsScreen } from '../screens/my-workouts'
import { StatsScreen } from '../screens/stats'
import { HomeStackNavigator } from './HomeStackNavigator'

const Tab = createBottomTabNavigator()
const homeLightIcon = require('./home-light.png')
const homeDarkIcon = require('./home-dark.png')
const trainingLightIcon = require('./training-light.png')
const trainingDarkIcon = require('./training-dark.png')
const statsDarkIcon = require('./stats-dark.png')
const statsLightIcon = require('./stats-light.png')

function getTabIcon(routeName: string, focused: boolean) {
  switch (routeName) {
    case 'MyWorkouts':
      return focused ? trainingDarkIcon : trainingLightIcon
    case 'Stats':
      return focused ? statsDarkIcon : statsLightIcon
    case 'Home':
    default:
      return focused ? homeDarkIcon : homeLightIcon
  }
}

const screensWithNoTabs = ['Reward', 'Training']

export function BottomTabNavigator() {

  function getTabBarVisible(route: any){
    if(!route || !route.state || !route.state.routes || !route.state.routes.length){
      return true
    }

    const routeName = route.state.routes[route.state.routes.length-1].name
    return screensWithNoTabs.some(screenName => screenName === routeName) === false
  }
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
          paddingBottom: 8,
        },
        style: {
          height: Platform.OS === 'ios' ? 100 : 60,
          paddingTop: 8
        }
      }}
    >
      <Tab.Screen name="Home" options={({route}) => ({tabBarLabel: i18n.t('Tab bar - Home'), tabBarVisible: getTabBarVisible(route)})} component={HomeStackNavigator}/>
      <Tab.Screen name="MyWorkouts" options={{tabBarLabel: i18n.t('Tab bar - MyWorkouts')}} component={MyWorkoutsScreen}/>
      <Tab.Screen name="Stats" options={{tabBarLabel: i18n.t('Tab bar - Stats')}} component={StatsScreen}/>
    </Tab.Navigator>
  )
}
