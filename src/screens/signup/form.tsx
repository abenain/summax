import { Datepicker, Icon, Input, Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import moment from 'moment'
import * as React from 'react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { StyleSheet, TouchableWithoutFeedback } from 'react-native'

const DEFAULT_DOB_AS_STRING = '01/01/1980'
const MIN_DOB = moment().subtract(120, 'years').toDate()
const MAX_DOB = moment().subtract(10, 'years').toDate()
const DOB_FORMAT = 'DD/MM/YYYY'

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
  const [dob, setDob] = useState(moment(DEFAULT_DOB_AS_STRING, DOB_FORMAT).toDate())
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

      <Text category='h4' style={styles.title}>SUMMAX</Text>

      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Firstname')}
        value={firstname}
        onChangeText={setFirstname}
        textStyle={{ fontWeight: 'bold' }}
      />
      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Lastname')}
        value={lastname}
        onChangeText={setLastname}
        textStyle={{ fontWeight: 'bold' }}
      />
      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Email')}
        value={email}
        onChangeText={setEmail}
        textStyle={{ fontWeight: 'bold' }}
      />
      <Datepicker
        date={dob}
        max={MAX_DOB}
        min={MIN_DOB}
        placeholder={i18n.t('Placeholder - DOB')}
        style={styles.input}
        onSelect={setDob}
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
      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Password confirm')}
        value={passwordConfirm}
        secureTextEntry={true}
        onChangeText={setPasswordConfirm}
        textStyle={{ fontWeight: 'bold' }}
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
    marginBottom: 32,
  },
  input    : {
    marginBottom: 22
  },
})