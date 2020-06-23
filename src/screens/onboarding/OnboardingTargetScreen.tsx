import { Text } from '@ui-kitten/components'
import * as React from 'react'
import { SafeAreaView } from 'react-native'
import { BaseScreen } from './BaseScreen'

export function OnboardingTargetScreen() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'wihte'}}>
      <BaseScreen>
        <Text category={'h1'}>Onboarding 2</Text>
      </BaseScreen>
    </SafeAreaView>
  )
}