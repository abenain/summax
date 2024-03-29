import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Layout, Text } from '@ui-kitten/components'
import * as Amplitude from 'expo-analytics-amplitude'
import i18n from 'i18n-js'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Switch, TextInput } from 'react-native'
import HideWithKeyboard from 'react-native-hide-with-keyboard'
import { useDispatch } from 'react-redux'
import { Maybe } from 'tsmonad'
import { EVENTS } from '../../amplitude'
import { RootStackParamList } from '../../App'
import { SummaxColors } from '../../colors'
import { Loading } from '../../components/Loading'
import { ActionType } from '../../redux/actions'
import { Sex } from '../../types'
import { callAuthenticatedWebservice } from '../../webservices'
import { updateUser } from '../../webservices/user'
import { BaseScreen } from './BaseScreen'

const manLightIcon = require('./sex/man-light.png')
const manDarkIcon = require('./sex/man-dark.png')
const womanLightIcon = require('./sex/woman-light.png')
const womanDarkIcon = require('./sex/woman-dark.png')

function getWomanIcon(selectedSex: Sex) {
  if (selectedSex === Sex.FEMALE) {
    return womanDarkIcon
  }

  return womanLightIcon
}

function getManIcon(selectedSex: Sex) {
  if (selectedSex === Sex.MALE) {
    return manDarkIcon
  }

  return manLightIcon
}

function getSex(checked: boolean) {
  if (checked) {
    return Sex.MALE
  }

  return Sex.FEMALE
}

export function OnboardingSexScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const dispatch = useDispatch()
  const [isMale, setIsMale] = useState(false)
  const [heightCm, setHeightCm] = useState('')
  const [heightError, setHeightError] = useState(false)
  const [weightKg, setWeightKg] = useState('')
  const [weightError, setWeightError] = useState(false)
  const [isLoading, setLoading] = useState(false)

  useEffect(function componentDidMount() {
    Amplitude.logEvent(EVENTS.SHOWED_ONBOARDING_SEX_PAGE)
  }, [])

  function goToNextPage() {
    if (!heightCm || !weightKg) {
      setHeightError(Boolean(heightCm) === false)
      setWeightError(Boolean(weightKg) === false)
      return
    }

    setLoading(true)
    callAuthenticatedWebservice(updateUser, {
      userData: {
        heightCm: Number(heightCm),
        sex     : isMale ? Sex.MALE : Sex.FEMALE,
        weightKg: Number(weightKg),
      },
    }).then(maybeUser => {
      setLoading(false)
      maybeUser.caseOf({
        just   : user => {
          dispatch({
            type: ActionType.LOADED_USERDATA,
            user: Maybe.just(user)
          })
          navigation.push('OnboardingObjectives')
        },
        nothing: () => {
        }
      })
    })
  }

  return isLoading ? (
    <Loading/>
  ) : (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
        style={{ flex: 1 }}
      >
        <BaseScreen onContinue={goToNextPage} progress={{ current: 1, total: 2 }}>
          <HideWithKeyboard>
            <Text style={styles.instructions}>
              {i18n.t('Onboarding - Sex - Instructions')}
            </Text>
          </HideWithKeyboard>

          <Layout style={styles.sexSelectionIconsContainer}>
            <Image resizeMode={'contain'} source={getWomanIcon(getSex(isMale))}
                   style={[styles.sexIcon, { marginRight: 30 }]}/>
            <Image resizeMode={'contain'} source={getManIcon(getSex(isMale))} style={styles.sexIcon}/>
          </Layout>

          <Layout style={styles.sexSelectionSwitchContainer}>
            <Text style={[styles.inputText, { marginRight: 18 }]}>{i18n.t('Sex - Female - Initials')}</Text>
            <Switch ios_backgroundColor={SummaxColors.lightGrey}
                    onValueChange={checked => setIsMale(checked)}
                    style={{ borderColor: SummaxColors.lightishGreen, borderWidth: 1 }}
                    thumbColor={SummaxColors.lightishGreen}
                    trackColor={{ false: SummaxColors.lightGrey, true: SummaxColors.darkGrey }}
                    value={isMale}/>
            <Text style={[styles.inputText, { marginLeft: 14 }]}>{i18n.t('Sex - Male - Initials')}</Text>
          </Layout>

          <Layout style={styles.heightAndWeightContainer}>
            <TextInput
              keyboardType={'number-pad'}
              onChangeText={(value: string) => {
                setHeightCm(value)
                setHeightError(false)
              }}
              placeholder={i18n.t('Placeholder - Height')}
              placeholderTextColor={heightError ? 'white' : SummaxColors.blueGrey}
              style={[styles.input, styles.inputText, { marginRight: 16 }, heightError ? styles.inputError : {}]}
              value={heightCm}
            />
            <TextInput
              keyboardType={'number-pad'}
              onChangeText={(value: string) => {
                setWeightKg(value)
                setWeightError(false)
              }}
              placeholder={i18n.t('Placeholder - Weight')}
              placeholderTextColor={weightError ? 'white' : SummaxColors.blueGrey}
              style={[styles.input, styles.inputText, weightError ? styles.inputError : {}]}
              value={weightKg}
            />
          </Layout>

        </BaseScreen>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  instructions               : {
    color       : SummaxColors.dark,
    fontFamily  : 'nexaRegular',
    fontSize    : 14,
    lineHeight  : 20,
    marginBottom: 47,
    textAlign   : 'center',
  },
  sexSelectionIconsContainer : {
    flexDirection : 'row',
    justifyContent: 'center',
    marginBottom  : 53,
    flex          : 1,
  },
  sexIcon                    : {
    height: '100%',
    width : '30%',
  },
  sexSelectionSwitchContainer: {
    alignItems    : 'center',
    flexDirection : 'row',
    justifyContent: 'center',
    marginBottom  : 62,
  },
  inputText                  : {
    color     : SummaxColors.blueGrey,
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 20,
  },
  heightAndWeightContainer   : {
    alignItems    : 'center',
    flexDirection : 'row',
    justifyContent: 'space-between',
    marginBottom  : 32,
  },
  input                      : {
    backgroundColor  : SummaxColors.lightGrey,
    borderWidth      : 0,
    flex             : 1,
    height           : 48,
    paddingHorizontal: 16,
  },
  inputError                 : {
    backgroundColor: SummaxColors.salmonPink,
    borderColor    : 'crimson',
    borderWidth    : 2,
    color          : 'white'
  },
})
