import { useNavigation } from '@react-navigation/native'
import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { SummaxColors } from '../../colors'
import { Loading } from '../../components/Loading'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { ActionType } from '../../redux/actions'
import { GlobalState } from '../../redux/store'
import { fetchHomepageSequence } from '../../sequences'
import { Objectives } from '../../types'
import { callAuthenticatedWebservice } from '../../webservices'
import { updateUser } from '../../webservices/user'
import { Form } from '../onboarding/objectives/Form'

export function ProfileObjectivesScreen() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [objectives, setObjectives] = useState<Objectives[]>([])
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(Maybe.nothing<string>())
  const user = useSelector(({ userData: { user } }: GlobalState) => user)

  useEffect(() => {
    user.caseOf({
      just   : user => {
        setObjectives(user.objectives)
      },
      nothing: () => {
      }
    })
  }, [])

  function savePreferences() {
    if (objectives.length === 0) {
      setError(Maybe.just(i18n.t('Onboarding - Objectives - Select at least one')))
      return
    }

    setLoading(true)
    callAuthenticatedWebservice(updateUser, {
      userData: {
        objectives,
      },
    }).then(maybeUser => {

      maybeUser.caseOf({
        just   : user => {
          dispatch({
            type: ActionType.LOADED_USERDATA,
            user: Maybe.just(user)
          })

          fetchHomepageSequence().then(() => {
            setLoading(false)
            navigation.goBack()
          })

        },
        nothing: () => setLoading(false)
      })
    })
  }

  return isLoading ? (
    <Loading/>
  ) : (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>

      <Layout style={{ flex: 1, padding: 16 }}>

        <ScrollView style={{ flex: 1 }}>
          <Form values={objectives} onChange={setObjectives}/>

          {error.caseOf({
            just   : errorMessage => (
              <Layout style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              </Layout>
            ),
            nothing: () => null
          })}
        </ScrollView>

        <Layout style={{ alignSelf: 'stretch', height: 56 }}>
          <SummaxButton
            buttonStyle={ButtonStyle.GREEN}
            onPress={savePreferences}
            text={i18n.t('Save')}/>
        </Layout>

      </Layout>


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  errorContainer: {
    justifyContent   : 'center',
    backgroundColor  : SummaxColors.salmonPink,
    borderRadius     : 5,
    height           : 60,
    marginBottom     : 16,
    marginTop        : 32,
    paddingHorizontal: 16,
  },
  errorMessage  : {
    color     : 'white',
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 20,
  },
})