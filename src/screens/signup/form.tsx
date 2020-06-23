import { Datepicker, Icon, Input, Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import moment from 'moment'
import * as React from 'react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Image, StyleSheet, TouchableWithoutFeedback } from 'react-native'

const MIN_DOB = moment().subtract(120, 'years').toDate()
const MAX_DOB = moment().subtract(10, 'years').toDate()

const summax = require('./summax.png')

interface Props {

}

export interface FormHandle {
  getValues: () => ({
    email: string,
    firstname: string,
    lastname: string,
    password: string,
    passwordConfirm: string,
  })
}

export const Form = forwardRef(({}: Props, ref) => {
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState(null)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  useImperativeHandle(ref, () => ({
    getValues: function () {
      return {
        email,
        dob,
        firstname,
        lastname,
        password,
        passwordConfirm,
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
        placeholder={i18n.t('Placeholder - Firstname')}
        value={firstname}
        onChangeText={setFirstname}
        textStyle={styles.inputText}
      />
      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Lastname')}
        value={lastname}
        onChangeText={setLastname}
        textStyle={styles.inputText}
      />
      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Email')}
        value={email}
        onChangeText={setEmail}
        textStyle={styles.inputText}
      />
      <Datepicker
        date={dob}
        max={MAX_DOB}
        min={MIN_DOB}
        placeholder={props => {
          const {style, ...restOfProps} = props
          return <Text {...restOfProps} style={[style, styles.inputText]}>{i18n.t('Placeholder - DOB')}</Text>
        }}
        style={{...styles.input, ...styles.inputText}}
        onSelect={setDob}
      />
      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Password')}
        value={password}
        accessoryRight={renderShowPasswordIcon}
        secureTextEntry={secureTextEntry}
        onChangeText={setPassword}
        textStyle={styles.inputText}
      />
      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Password confirm')}
        value={passwordConfirm}
        secureTextEntry={true}
        onChangeText={setPasswordConfirm}
        textStyle={styles.inputText}
      />

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
    marginBottom: 64,
    width       : 103,
    height      : 20,
  },
  input    : {
    marginBottom: 22
  },
  inputText    : {
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    fontWeight: 'bold',
  },
})