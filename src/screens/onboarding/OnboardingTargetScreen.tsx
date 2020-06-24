import { Text } from '@ui-kitten/components'
import * as React from 'react'
import { SafeAreaView } from 'react-native'
import { BaseScreen } from './BaseScreen'

export function OnboardingTargetScreen() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'wihte'}}>
      <BaseScreen progress={{current: 2, total: 2}}>
        <Text category={'h1'}>Onboarding 2</Text>
      </BaseScreen>
    </SafeAreaView>
  )
}