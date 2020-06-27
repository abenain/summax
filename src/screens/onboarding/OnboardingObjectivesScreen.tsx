import { useNavigation } from '@react-navigation/native'
import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { SummaxColors } from '../../colors'
import { Loading } from '../../components/Loading'
import { ActionType } from '../../redux/actions'
import { GlobalState } from '../../redux/store'
import { Objectives } from '../../types'
import { NoOp } from '../../utils'
import { updateUser } from '../../webservices/user'
import { BaseScreen } from './BaseScreen'
import { Form } from './objectives/Form'

export function OnboardingObjectivesScreen() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(Maybe.nothing<string>())
  const [objectives, setObjectives] = useState<Objectives[]>([])
  const accessToken = useSelector(({ userData: { accessToken } }: GlobalState) => accessToken)

  function goToNextScreen() {
    if (objectives.length === 0) {
      setError(Maybe.just(i18n.t('Onboarding - Objectives - Select at least one')))
      return
    }

    setLoading(true)
    updateUser({
      userData: {
        objectives,
        onboarded: true
      },
      token   : accessToken.valueOr(null)
    }).then(maybeUser => {
      setLoading(false)
      maybeUser.caseOf({
        just   : user => {
          dispatch({
            type: ActionType.LOADED_USERDATA,
            user: Maybe.just(user)
          })
          navigation.navigate('Home')
        },
        nothing: NoOp
      })
    })
  }

  function onObjectivesChanged(values: Objectives[]) {
    setError(Maybe.nothing())
    setObjectives(values)
  }

  return isLoading ? (
    <Loading/>
  ) : (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BaseScreen
        onContinue={goToNextScreen}
        progress={{ current: 2, total: 2 }}>

        <ScrollView style={{ flex: 1 }}>

          <Text style={styles.instructions}>{i18n.t('Onboarding - Objectives - Instructions')}</Text>
          <Text
            style={[styles.instructions, styles.smallInstructions]}>{i18n.t('Onboarding - Objectives - Instructions Small')}</Text>

          <Form onChange={onObjectivesChanged} values={objectives}/>

          {error.caseOf({
            just   : errorMessage => (
              <Layout style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              </Layout>
            ),
            nothing: () => null
          })}

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
  errorContainer   : {
    justifyContent   : 'center',
    backgroundColor  : SummaxColors.salmonPink,
    borderRadius     : 5,
    height           : 60,
    marginBottom     : 16,
    marginTop        : 32,
    paddingHorizontal: 16,
  },
  errorMessage     : {
    color     : 'white',
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 20,
  },
})