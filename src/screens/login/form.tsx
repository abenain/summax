import { Icon, Input, Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Image, StyleSheet, TouchableWithoutFeedback } from 'react-native'

const summax = require('./summax.png')

interface Props {

}

export interface FormHandle {
  getValues: () => ({
    email: string,
    password: string,
  })
}

export const Form = forwardRef(({}: Props, ref) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  useImperativeHandle(ref, () => ({
    getValues: function () {
      return {
        email,
        password
      }
    }
  }))

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  const renderShowPasswordIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}/>
    </TouchableWithoutFeedback>
  )

  return (
    <Layout style={styles.container}>

      <Image source={summax} style={styles.title}/>

      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Email')}
        value={email}
        onChangeText={setEmail}
        textStyle={{ fontWeight: 'bold' }}
      />
      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Password')}
        value={password}
        accessoryRight={renderShowPasswordIcon}
        secureTextEntry={secureTextEntry}
        onChangeText={setPassword}
        textStyle={{ fontWeight: 'bold' }}
      />

      <Text category='s1'
            style={{ marginBottom: 32, textDecorationLine: 'underline' }}>{i18n.t('Sign in - Forgot password')}</Text>

      <Layout style={{ height: 100 }}/>

      <Layout style={{ flexDirection: 'row' }}>
        <Text category='p1' style={{ marginRight: 8 }}>{i18n.t('Sign in - No account yet')}</Text>
        <Text category='s1' style={{ textDecorationLine: 'underline' }}>{i18n.t('Sign in - Go to sign up')}</Text>
      </Layout>

    </Layout>
  )
})

const styles = StyleSheet.create({
  container: {
    backgroundColor  : '#ffffff',
    borderRadius     : 5,
    paddingHorizontal: 16,
    paddingVertical  : 32,
  },
  title    : {
    alignSelf   : 'center',
    marginBottom: 32,
    width       : 103,
    height      : 20,
  },
  input    : {
    marginBottom: 22
  },
})