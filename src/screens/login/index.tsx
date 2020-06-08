import { StackNavigationProp } from '@react-navigation/stack'
import { Button, Layout } from '@ui-kitten/components'
import i18n from 'i18n-js'
import { useRef } from 'react'
import * as React from 'react'
import { ImageBackground, StyleSheet } from 'react-native'
import { RootStackParamList } from '../../App'
import { SummaxColors } from '../../colors'
import { Form as LoginForm, FormHandle } from './form'

const backgroundImage = require('../../../assets/login_background.png')

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>
}

export function Login({navigation}: Props) {
  const loginForm = useRef<FormHandle>()

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>

      <LoginForm ref={loginForm}/>

      <Layout style={styles.buttonContainer}>
        <Button
          status='control'
          style={[styles.button, styles.signUpButton]}
          onPress={() => navigation.navigate('SignUp')}
          appearance='outline' size='giant'>
          {i18n.t('Sign up')}
        </Button>
        <Button
          status='success'
          style={[styles.button, styles.signInButton]}
          appearance='filled'
          onPress={() => console.log(loginForm.current.getValues())}
          size='giant'>
          {i18n.t('Sign in')}
        </Button>
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