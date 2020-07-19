import { Card, Icon, Input, Layout, Spinner, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Dimensions, Keyboard, Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { Maybe } from 'tsmonad'
import { SummaxColors } from '../../colors'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { callAuthenticatedWebservice } from '../../webservices'
import { updateUser } from '../../webservices/user'

interface Props {
  onDismiss: () => void
  visible: boolean
}

const { height: screenHeight } = Dimensions.get('window')

export function PasswordModal({ onDismiss, visible }: Props) {
  const [error, setError] = useState(Maybe.nothing<string>())
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  function renderShowPasswordIcon(props) {
    return (
      <TouchableWithoutFeedback onPress={toggleSecureEntry}>
        <Icon {...props} name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}/>
      </TouchableWithoutFeedback>
    )
  }

  useEffect(() => {
    setError(Maybe.nothing())
    setSuccess(false)
    setIsLoading(false)
    setPassword('')
    setPasswordConfirm('')
  }, [visible])

  useEffect(() => {
    if (success) {
      setTimeout(onDismiss, 2000)
    }
  }, [success])

  function onSavePassword() {
    Keyboard.dismiss()

    if (!password || !passwordConfirm) {
      setError(Maybe.just(i18n.t('Change Password - Fill in the fields')))
      return
    }

    if (password !== passwordConfirm) {
      setError(Maybe.just(i18n.t('Change Password - Password mismatch')))
      return
    }

    setError(Maybe.nothing())

    setIsLoading(true)
    callAuthenticatedWebservice(updateUser, { userData: { password } })
      .then(maybeSuccess => {
        setIsLoading(false)
        maybeSuccess.caseOf({
          just   : () => setSuccess(true),
          nothing: () => setError(Maybe.just(i18n.t('Change Password - Error')))
        })
      })
  }

  function getButtons() {
    if (isLoading) {
      return (
        <SummaxButton buttonStyle={ButtonStyle.WHITE_GREEN_TEXT}>
          <Spinner size='giant' status='success'/>
        </SummaxButton>
      )
    }

    if (success) {
      return (
        <SummaxButton buttonStyle={ButtonStyle.WHITE_GREEN_TEXT} text={i18n.t('Change Password - Success')}/>
      )
    }

    return (
      <>
        <SummaxButton
          buttonStyle={ButtonStyle.WHITE_GREEN_TEXT}
          disabled={isLoading}
          onPress={() => onDismiss()}
          style={{ marginRight: 16 }}
          text={i18n.t('Cancel')}
        />
        <SummaxButton
          buttonStyle={ButtonStyle.GREEN}
          disabled={isLoading}
          onPress={() => onSavePassword()}
          text={i18n.t('Save')}
        />
      </>
    )
  }

  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      presentationStyle={'overFullScreen'}
      visible={visible}
    >
      <View style={styles.mainContainer}>
        <View style={styles.modalWrapper}>

          <View style={styles.modalContainer}>
            <Card disabled={true}>

              <Text style={styles.title}>{i18n.t('Change Password')}</Text>

              <Input
                style={styles.input}
                placeholder={i18n.t('Placeholder - New Password')}
                value={password}
                accessoryRight={renderShowPasswordIcon}
                secureTextEntry={secureTextEntry}
                onChangeText={(value: string) => {
                  setError(Maybe.nothing())
                  setPassword(value)
                }}
                textStyle={styles.inputText}
              />
              <Input
                style={styles.input}
                placeholder={i18n.t('Placeholder - Password confirm')}
                value={passwordConfirm}
                secureTextEntry={secureTextEntry}
                onChangeText={(value: string) => {
                  setError(Maybe.nothing())
                  setPasswordConfirm(value)
                }}
                textStyle={styles.inputText}
              />

              <Layout style={styles.passwordModalButtonContainer}>
                {getButtons()}
              </Layout>

            </Card>
          </View>

          {error.caseOf({
            just   : errorMessage => (
              <Layout style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              </Layout>
            ),
            nothing: () => null
          })}

        </View>
      </View>

    </Modal>
  )
}

const styles = StyleSheet.create({
  mainContainer               : { flex: 1, width: '100%' },
  modalWrapper                : {
    alignItems     : 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent : 'flex-start',
    height         : screenHeight,
    paddingTop     : '30%',
  },
  modalContainer              : {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius   : 10,
    width          : '100%',
  },
  title                       : {
    fontFamily  : 'aktivGroteskXBold',
    fontSize    : 30,
    lineHeight  : 30,
    marginBottom: 32,
    marginTop   : 16,
  },
  input                       : {
    marginBottom: 22
  },
  inputText                   : {
    fontFamily: 'nexaXBold',
    fontSize  : 14,
  },
  passwordModalButtonContainer: {
    flexDirection: 'row',
    marginTop    : 16
  },
  errorContainer              : {
    justifyContent   : 'center',
    backgroundColor  : SummaxColors.salmonPink,
    borderRadius     : 5,
    height           : 60,
    marginVertical   : 16,
    paddingHorizontal: 16,
  },
  errorMessage                : {
    color     : 'white',
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 20,
  },
})