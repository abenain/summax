import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Layout, Text } from '@ui-kitten/components'
import * as Amplitude from 'expo-analytics-amplitude'
import i18n from 'i18n-js'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { ImageBackground, KeyboardAvoidingView, Platform, StatusBar, StyleSheet } from 'react-native'
import HideWithKeyboard from 'react-native-hide-with-keyboard'
import { useDispatch } from 'react-redux'
import { Maybe } from 'tsmonad'
import { EVENTS } from '../../amplitude'
import { RootStackParamList } from '../../App'
import { SummaxColors } from '../../colors'
import { Loading } from '../../components/Loading'
import { OtpForm } from '../../components/OtpForm'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { ActionType } from '../../redux/actions'
import { checkOtp, resendOtp } from '../../webservices/user'

const backgroundImage = require('../../../assets/login_background.png')

export function SignUpOtpScreen() {
  const [error, setError] = useState(Maybe.nothing<string>())
  const [isLoading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const navigation = useNavigation()
  const route = useRoute<RouteProp<RootStackParamList, 'Workout'>>()
  const { id: userId } = route.params
  const dispatch = useDispatch()

  useEffect(function componentDidMount() {
    Amplitude.logEvent(EVENTS.SHOWED_SIGNUP_OTP_PAGE)
  }, [])

  function doCheckOtp() {
    if (!otp || otp.length < 4) {
      setError(Maybe.just(i18n.t('Sign up otp - OTP Incomplete')))
      return
    }

    setError(Maybe.nothing())
    setLoading(true)

    checkOtp(userId, otp)
      .then(maybeTokens => {
        setLoading(false)
        maybeTokens.caseOf({
          just   : ({ access, refresh }) => {
            dispatch({
              type: ActionType.GOT_TOKENS,
              access,
              refresh,
            })
            navigation.navigate('OnboardingSex')
          },
          nothing: () => {
            setError(Maybe.just(i18n.t('Sign up otp - wrong OTP')))
          }
        })
      })
  }

  async function resendOtpEmail() {
    setError(Maybe.nothing())
    setLoading(true)
    await resendOtp(userId)
    setOtp('')
    setLoading(false)
  }

  return isLoading ? (
    <Loading/>
  ) : (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle={'light-content'}/>

        <Layout style={{ backgroundColor: 'transparent', flex: 1 }}/>

        {error.caseOf({
          just   : errorMessage => (
            <HideWithKeyboard>
              <Layout style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              </Layout>
            </HideWithKeyboard>
          ),
          nothing: () => null
        })}


        <Layout style={styles.formContainer}>
          <OtpForm
            message={i18n.t('Sign up otp - Message')}
            onChange={(value: string) => {
              setOtp(value)
              setError(Maybe.nothing())
            }}
            onResendCodeRequest={resendOtpEmail}
            value={otp}/>

          <HideWithKeyboard>
            <Layout style={{ backgroundColor: 'transparent', height: 40 }}/>
          </HideWithKeyboard>
        </Layout>

        <Layout style={styles.buttonContainer}>
          <SummaxButton
            buttonStyle={ButtonStyle.GREEN}
            onPress={doCheckOtp}
            text={i18n.t('Sign up otp - Button')}
          />
        </Layout>
      </KeyboardAvoidingView>

    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background     : {
    flex             : 1,
    alignItems       : 'stretch',
    paddingHorizontal: 16,
    paddingBottom    : 36,
  },
  errorContainer : {
    justifyContent   : 'center',
    backgroundColor  : SummaxColors.salmonPink,
    borderRadius     : 5,
    height           : 60,
    marginBottom     : 16,
    paddingHorizontal: 16,
  },
  errorMessage   : {
    color     : 'white',
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 20,
  },
  formContainer  : {
    borderRadius: 5,
  },
  buttonContainer: {
    paddingTop     : 36,
    flexDirection  : 'row',
    backgroundColor: 'transparent'
  },
  button         : {
    alignSelf      : 'stretch',
    margin         : 0,
    height         : 56,
    backgroundColor: SummaxColors.lightishGreen,
    marginTop      : 32,
  },
})