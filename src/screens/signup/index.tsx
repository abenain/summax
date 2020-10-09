import { useNavigation } from '@react-navigation/native'
import { HeaderHeightContext } from '@react-navigation/stack'
import { Layout, Text } from '@ui-kitten/components'
import * as Amplitude from 'expo-analytics-amplitude'
import i18n from 'i18n-js'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { Maybe } from 'tsmonad'
import { EVENTS } from '../../amplitude'
import { SummaxColors } from '../../colors'
import { Loading } from '../../components/Loading'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { ActionType } from '../../redux/actions'
import { createUserWithoutOtp } from '../../webservices/user'
import { Form as SignUpForm } from './form'

const backgroundImage = require('../../../assets/login_background.png')

export function SignUpScreen() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [confirmPassword, setConfirmPassword] = useState('')
  const [dob, setDob] = useState(null)
  const [email, setEmail] = useState('')
  const [error, setError] = useState(Maybe.nothing<string>())
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setLoading] = useState(false)

  useEffect(function componentDidMount() {
    Amplitude.logEvent(EVENTS.SHOWED_SIGNUP_PAGE)
  }, [])

  function doSignUp() {
    if (!confirmPassword || !dob || !email || !firstname || !lastname || !password) {
      setError(Maybe.just(i18n.t('Sign up - Fill in the fields')))
      return
    }

    if (confirmPassword !== password) {
      setError(Maybe.just(i18n.t('Sign up - Password mismatch')))
      return
    }

    setError(Maybe.nothing())
    setLoading(true)

    createUserWithoutOtp({ dob, email, firstname, lastname, password })
      .then(maybeUser => {
        setLoading(false)
        maybeUser.caseOf({
          just   : ({ access, refresh, ...user }) => {
            dispatch({
              type: ActionType.LOADED_USERDATA,
              user: Maybe.just(user)
            })
            dispatch({
              type: ActionType.GOT_TOKENS,
              access,
              refresh,
            })
            navigation.navigate('OnboardingSex', { id: user._id })
          },
          nothing: () => setError(Maybe.just(i18n.t('Sign up - Email already in use')))
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
          flex: 1,
        }}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      >
        <HeaderHeightContext.Consumer>
          {headerHeight => (
            <Layout style={{ marginTop: headerHeight, backgroundColor: 'transparent', flex: 1 }}>

              <Layout style={{ flex: 100, backgroundColor: 'transparent' }}/>

              <ScrollView>
                {error.caseOf({
                  just   : errorMessage => (
                    <Layout style={styles.errorContainer}>
                      <Text style={styles.errorMessage}>{errorMessage}</Text>
                    </Layout>
                  ),
                  nothing: () => null
                })}

                <SignUpForm confirmPasswordValue={confirmPassword}
                            dobValue={dob}
                            emailValue={email}
                            firstnameValue={firstname}
                            lastnameValue={lastname}
                            onConfirmPasswordChanged={(value: string) => {
                              setConfirmPassword(value)
                              setError(Maybe.nothing())
                            }}
                            onDobChanged={(value: Date) => {
                              setDob(value)
                              setError(Maybe.nothing())
                            }}
                            onEmailChanged={(value: string) => {
                              setEmail(value)
                              setError(Maybe.nothing())
                            }}
                            onFirstnameChanged={(value: string) => {
                              setFirstname(value)
                              setError(Maybe.nothing())
                            }}
                            onLastnameChanged={(value: string) => {
                              setLastname(value)
                              setError(Maybe.nothing())
                            }}
                            onPasswordChanged={(value: string) => {
                              setPassword(value)
                              setError(Maybe.nothing())
                            }}
                            passwordValue={password}/>
              </ScrollView>

              <Layout style={styles.buttonContainer}>
                <SummaxButton
                  buttonStyle={ButtonStyle.GREEN}
                  onPress={doSignUp}
                  text={i18n.t('Sign up')}
                />
              </Layout>

            </Layout>
          )}
        </HeaderHeightContext.Consumer>

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