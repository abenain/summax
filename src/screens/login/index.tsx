import { StackNavigationProp } from '@react-navigation/stack'
import { Layout } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useRef } from 'react'
import { ImageBackground, StatusBar, StyleSheet } from 'react-native'
import { RootStackParamList } from '../../App'
import { SummaxColors } from '../../colors'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { Form as LoginForm, FormHandle } from './form'

const backgroundImage = require('../../../assets/login_background.png')

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>
}

export function LoginScreen({ navigation }: Props) {
  const loginForm = useRef<FormHandle>()

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>

      <StatusBar barStyle={'light-content'}/>

      <LoginForm ref={loginForm}/>

      <Layout style={styles.buttonContainer}>
        <SummaxButton
          buttonStyle={ButtonStyle.BLACK}
          onPress={() => navigation.navigate('SignUp')}
          text={i18n.t('Sign up')}
        />
        <SummaxButton
          buttonStyle={ButtonStyle.GREEN}
          onPress={() => {
            console.log(loginForm.current.getValues())
            navigation.replace('Home')
          }}
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