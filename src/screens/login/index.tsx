import { StackNavigationProp } from '@react-navigation/stack'
import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { ImageBackground, StatusBar, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { RootStackParamList } from '../../App'
import { SummaxColors } from '../../colors'
import { Loading } from '../../components/Loading'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { ActionType } from '../../redux/actions'
import { GlobalState } from '../../redux/store'
import { fetchHomepageSequence, fetchUserDataSequence } from '../../sequences'
import { NoOp } from '../../utils'
import { authenticate } from '../../webservices/auth'
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
  const user = useSelector(({userData: {user}}: GlobalState) => user)

  useEffect(() => {
    user.caseOf({
      just: user => {
        if(user.onboarded){
          navigation.replace('Home')
        }else{
          navigation.replace('Onboarding')
        }
        setLoading(false)
      },
      nothing: NoOp
    })
  }, [user.valueOr(null)])

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
          dispatch({
            type: ActionType.GOT_TOKENS,
            access,
            refresh,
          })
          Promise.all([
            fetchHomepageSequence(access),
            fetchUserDataSequence(access)
          ])
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

  return isLoading ? (
    <Loading/>
  ) : (
    <ImageBackground source={backgroundImage} style={styles.background}>

      <StatusBar barStyle={'light-content'}/>

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
        onPasswordChanged={(password: string) => {
          setPassword(password)
          setError(Maybe.nothing())
        }}
        onSignUpPressed={goToSignUp}
        passwordValue={password}/>

      <Layout style={styles.buttonContainer}>
        <SummaxButton
          buttonStyle={ButtonStyle.BLACK}
          onPress={goToSignUp}
          text={i18n.t('Sign up')}
        />
        <SummaxButton
          buttonStyle={ButtonStyle.GREEN}
          onPress={onSignInButtonPress}
          text={i18n.t('Sign in')}
        />
      </Layout>

    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background     : {
    flex             : 1,
    justifyContent   : 'flex-end',
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