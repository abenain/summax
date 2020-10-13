import { useNavigation } from '@react-navigation/native'
import { Layout, Text } from '@ui-kitten/components'
import * as Amplitude from 'expo-analytics-amplitude'
import i18n from 'i18n-js'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { Maybe } from 'tsmonad'
import { EVENTS } from '../../amplitude'
import { SummaxColors } from '../../colors'
import { Loading } from '../../components/Loading'
import { Separator } from '../../components/separator'
import { ActionType } from '../../redux/actions'
import { fetchHomepageSequence } from '../../sequences'
import { PlanningIntensity, Skills } from '../../types'
import { callAuthenticatedWebservice } from '../../webservices'
import { updateUser } from '../../webservices/user'
import { BaseScreen } from './BaseScreen'
import { PlanningIntensityForm } from './skillsAndPlanning/PlanningIntensityForm'
import { SkillsForm } from './skillsAndPlanning/SkillsForm'

export function OnboardingSkillsAndPlanningScreen() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(Maybe.nothing<string>())
  const [skills, setSkills] = useState(Maybe.nothing<Skills>())
  const [planningIntensity, setPlanningIntensity] = useState(Maybe.nothing<PlanningIntensity>())

  useEffect(function componentDidMount() {
    Amplitude.logEvent(EVENTS.SHOWED_ONBOARDING_SKILLSANDPLANNING_PAGE)
  }, [])

  function goToNextScreen() {

    const hasSelectedSkills = skills.caseOf({
      just: () => true,
      nothing: () => false,
    })

    if (hasSelectedSkills === false) {
      setError(Maybe.just(i18n.t('Onboarding - Skills - Select one')))
      return
    }

    const hasSelectedPlanningIntensity = planningIntensity.caseOf({
      just: () => true,
      nothing: () => false,
    })

    if (hasSelectedPlanningIntensity === false) {
      setError(Maybe.just(i18n.t('Onboarding - Planning - Select one')))
      return
    }

    setLoading(true)
    callAuthenticatedWebservice(updateUser, {
      userData: {
        planningIntensity: planningIntensity.valueOr(null),
        sportSkills: skills.valueOr(null),
      },
    }).then(maybeUser => {

      maybeUser.caseOf({
        just   : user => {
          dispatch({
            type: ActionType.LOADED_USERDATA,
            user: Maybe.just(user)
          })

          fetchHomepageSequence().then(() => {
            navigation.navigate('Home')
          })

        },
        nothing: () => setLoading(false)
      })
    })
  }

  function onSkillsChanged(skills: Skills) {
    setError(Maybe.nothing())
    setSkills(Maybe.just(skills))
  }

  function onPlanningIntensityChanged(intensity: PlanningIntensity) {
    setError(Maybe.nothing())
    setPlanningIntensity(Maybe.just(intensity))
  }

  return isLoading ? (
    <Loading/>
  ) : (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BaseScreen
        onContinue={goToNextScreen}
        progress={{ current: 3, total: 3 }}>

        <ScrollView style={{ flex: 1 }}>

          <Text style={styles.instructions}>{i18n.t('Onboarding - Skills - Instructions')}</Text>

          <SkillsForm onChange={onSkillsChanged} value={skills}/>

          <Separator style={{marginVertical: 33}}/>

          <Text style={styles.instructions}>{i18n.t('Onboarding - Planning - Instructions')}</Text>
          <Text
            style={[styles.instructions, styles.smallInstructions]}>{i18n.t('Onboarding - Planning - Instructions Small')}</Text>

          <PlanningIntensityForm onChange={onPlanningIntensityChanged} value={planningIntensity}/>

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