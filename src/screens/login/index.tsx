import { StackNavigationProp } from '@react-navigation/stack'
import { Layout, Text } from '@ui-kitten/components'
import * as Amplitude from 'expo-analytics-amplitude'
import * as Facebook from 'expo-facebook'
import i18n from 'i18n-js'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { ImageBackground, KeyboardAvoidingView, Platform, StatusBar, StyleSheet } from 'react-native'
import { ShowWithKeyboard } from 'react-native-hide-with-keyboard'
import { useDispatch, useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { EVENTS } from '../../amplitude'
import { RootStackParamList } from '../../App'
import { SummaxColors } from '../../colors'
import { Loading } from '../../components/Loading'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { ActionType } from '../../redux/actions'
import { GlobalState } from '../../redux/store'
import { fetchHomepageSequence, fetchUserDataSequence } from '../../sequences'
import { NoOp } from '../../utils'
import { authenticate, authenticateWithFacebook } from '../../webservices/auth'
import { Form as LoginForm } from './form'

const backgroundImage = require('../../../assets/login_background.png')

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>
}

export function LoginScreen({ navigation }: Props) {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(Maybe.nothing<string>())
  const [isLoading, setLoading] = useState(false)
  const { accessToken, user } = useSelector(({ userData: { accessToken, user } }: GlobalState) => ({
    accessToken,
    user
  }))

  useEffect(function componentDidMount() {
    Amplitude.logEvent(EVENTS.SHOWED_LOGIN_PAGE)
  }, [])

  useEffect(() => {
    accessToken.caseOf({
      just   : () => {
        user.caseOf({
          just   : user => {
            if (user.onboarded) {
              navigation.replace('Home')
            } else {
              if (user.heightCm && user.weightKg) {
                navigation.replace('OnboardingObjectives')
              } else {
                navigation.replace('OnboardingSex')
              }
            }
            setLoading(false)
          },
          nothing: NoOp
        })
      },
      nothing: () => NoOp
    })

  }, [accessToken.valueOr(null), user.valueOr(null)])

  function onSignInButtonPress() {
    if (!email || !password) {
      setError(Maybe.just(i18n.t('Sign in - Fill in the fields')))
      return
    }

    setError(Maybe.nothing())
    setLoading(true)

    authenticate(email, password).then(maybeTokens => {
      maybeTokens.caseOf({
        just   : ({ access, refresh }) => {
          Promise.all([
            fetchHomepageSequence(access),
            fetchUserDataSequence(access)
          ]).then(() => {
            dispatch({
              type: ActionType.GOT_TOKENS,
              access,
              refresh,
            })
          })
        },
        nothing: () => {
          setError(Maybe.just(i18n.t('Sign in - Incorrect credentials')))
          setLoading(false)
        }
      })

    })
  }

  function goToSignUp() {
    navigation.navigate('SignUp')
  }

  function loginWithFacebook() {
    Amplitude.logEvent(EVENTS.LOGIN_WITH_FACEBOOK)
    return Facebook.initializeAsync({})
      .then(() => Facebook.logInWithReadPermissionsAsync({permissions: ["public_profile", "email"]}))
      .then(response => {
        if(response.type === 'success'){
          setLoading(true)
          authenticateWithFacebook(response.token).then(maybeTokens => {
            maybeTokens.caseOf({
              just   : ({ access, refresh }) => {
                Promise.all([
                  fetchHomepageSequence(access),
                  fetchUserDataSequence(access)
                ]).then(() => {
                  dispatch({
                    type: ActionType.GOT_TOKENS,
                    access,
                    refresh,
                  })
                })
              },
              nothing: () => {
                setError(Maybe.just(i18n.t('Sign in - Incorrect credentials')))
                setLoading(false)
              }
            })
          })
        }
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

        <LoginForm
          emailValue={email}
          onEmailChanged={(email: string) => {
            setEmail(email)
            setError(Maybe.nothing())
          }}
          onForgotPassword={(email?: string) => {
            navigation.navigate('ForgotPassword', { email })
          }}
          onLoginWithFacebookPressed={loginWithFacebook}
          onPasswordChanged={(password: string) => {
            setPassword(password)
            setError(Maybe.nothing())
          }}
          onSignUpPressed={goToSignUp}
          passwordValue={password}/>

        <Layout style={styles.buttonContainer}>
          <SummaxButton
            buttonStyle={ButtonStyle.TRANSPARENT}
            onPress={goToSignUp}
            text={i18n.t('Sign up')}
          />
          <SummaxButton
            buttonStyle={ButtonStyle.GREEN}
            onPress={onSignInButtonPress}
            text={i18n.t('Sign in')}
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
    flex  : 1,
    margin: 0,
    height: 56,
  },
  signUpButton   : {
    marginRight: 11,
    borderWidth: 2,
    borderColor: SummaxColors.lightishGreen
  },
  signInButton   : {
    backgroundColor: SummaxColors.lightishGreen
  },
})