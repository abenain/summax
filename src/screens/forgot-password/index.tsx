import { RouteProp, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Layout, Text } from '@ui-kitten/components'
import * as Amplitude from 'expo-analytics-amplitude'
import i18n from 'i18n-js'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { ImageBackground, KeyboardAvoidingView, Platform, StatusBar, StyleSheet } from 'react-native'
import { ShowWithKeyboard } from 'react-native-hide-with-keyboard'
import { Maybe } from 'tsmonad'
import { EVENTS } from '../../amplitude'
import { RootStackParamList } from '../../App'
import { SummaxColors } from '../../colors'
import { Loading } from '../../components/Loading'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { sendOtp } from '../../webservices/user'
import { Form as ForgotPasswordForm } from './form'

const backgroundImage = require('../../../assets/login_background.png')

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>
}

export function ForgotPasswordScreen({ navigation }: Props) {
  const route = useRoute<RouteProp<RootStackParamList, 'ForgotPassword'>>()
  const { email: userEmail } = route.params
  const [isLoading, setLoading] = useState(false)
  const [email, setEmail] = useState(userEmail || '')
  const [error, setError] = useState(Maybe.nothing<string>())

  useEffect(function componentDidMount() {
    Amplitude.logEvent(EVENTS.SHOWED_FORGOT_PASSWORD_PAGE)
  }, [])

  function onSendCodeButtonPress() {
    if (!email) {
      setError(Maybe.just(i18n.t('Forgot password - Fill in email')))
      return
    }

    setError(Maybe.nothing())
    setLoading(true)

    sendOtp(email)
      .then(maybeSuccess => {
        setLoading(false)
        maybeSuccess.caseOf({
          just: () => {
            navigation.navigate('ForgotPasswordOtp', {email})
          },
          nothing: () => {
            setError(Maybe.just(i18n.t('Forgot password - Send otp error')))
          }
        })
      })
  }

  return isLoading ? (
    <Loading/>
  ) : (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <StatusBar barStyle={'light-content'}/>

      <KeyboardAvoidingView
        style={{
          flex          : 1,
          justifyContent: 'flex-end',
          alignItems    : 'stretch',
        }}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      >

        {error.caseOf({
          just   : errorMessage => (
            <Layout style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            </Layout>
          ),
          nothing: () => null
        })}

        <ForgotPasswordForm emailValue={email} onEmailChanged={(email: string) => {
          setError(Maybe.nothing())
          setEmail(email)
        }}/>

        <Layout style={styles.buttonContainer}>
          <SummaxButton
            buttonStyle={ButtonStyle.GREEN}
            onPress={onSendCodeButtonPress}
            text={i18n.t('Forgot password - Send otp')}
          />
        </Layout>

        <ShowWithKeyboard>
          <Layout style={{ height: 36, backgroundColor: 'transparent' }}/>
        </ShowWithKeyboard>

      </KeyboardAvoidingView>

    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background     : {
    flex             : 1,
    paddingHorizontal: 16,
    paddingBottom    : 36,
  },
  buttonContainer: {
    paddingTop     : 36,
    flexDirection  : 'row',
    backgroundColor: 'transparent'
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
})