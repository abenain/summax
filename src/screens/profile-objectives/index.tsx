import { useNavigation } from '@react-navigation/native'
import { Layout } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { NoOp } from '../../utils'
import { Form } from '../onboarding/objectives/Form'

export function ProfileObjectivesScreen() {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>

      <Layout style={{ flex: 1, padding: 16 }}>

        <ScrollView style={{ flex: 1 }}>
          <Form values={[]} onChange={NoOp}/>
        </ScrollView>

        <Layout style={{ alignSelf: 'stretch', height: 56 }}>
          <SummaxButton
            buttonStyle={ButtonStyle.GREEN}
            onPress={() => navigation.goBack()}
            text={i18n.t('Save')}/>
        </Layout>

      </Layout>


    </SafeAreaView>
  )
}