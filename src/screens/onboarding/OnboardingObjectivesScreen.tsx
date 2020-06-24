import { useNavigation } from '@react-navigation/native'
import { Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import { useRef } from 'react'
import * as React from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { SummaxColors } from '../../colors'
import { BaseScreen } from './BaseScreen'
import { Form, FormHandle } from './objectives/Form'


export function OnboardingObjectivesScreen() {
  const navigation = useNavigation()
  const form = useRef<FormHandle>()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BaseScreen
        onContinue={() => {
          console.log(form.current.getValues())
          navigation.navigate('Home')
        }}
        progress={{ current: 2, total: 2 }}>

        <ScrollView style={{ flex: 1 }}>

          <Text style={styles.instructions}>{i18n.t('Onboarding - Objectives - Instructions')}</Text>
          <Text
            style={[styles.instructions, styles.smallInstructions]}>{i18n.t('Onboarding - Objectives - Instructions Small')}</Text>

          <Form ref={form}/>

        </ScrollView>

      </BaseScreen>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  instructions     : {
    color     : SummaxColors.dark,
    fontFamily: 'nexaRegular',
    fontSize  : 14,
    lineHeight: 20,
    textAlign : 'center',
  },
  smallInstructions: {
    color     : SummaxColors.blueGrey,
    fontSize  : 12,
    lineHeight: 20,
  },
})