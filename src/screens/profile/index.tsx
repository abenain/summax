import { useNavigation } from '@react-navigation/native'
import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import moment from 'moment'
import * as React from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { ErrorPage } from '../../components/ErrorPage'
import { Separator } from '../../components/separator'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { ActionType } from '../../redux/actions'
import { GlobalState } from '../../redux/store'
import { Sex } from '../../types'
import { Field } from './Field'

const enveloppeIcon = require('./enveloppe.png')
const phoneIcon = require('./phone.png')
const summaxIcon = require('../../../assets/summax.png')
const { expo: { version = '' } = {} } = require('../../../app.json')

function getSexString(sex: Sex) {
  switch (sex) {
    case Sex.MALE:
      return i18n.t('Sex - Male')
    case Sex.FEMALE:
    default:
      return i18n.t('Sex - Female')
  }
}

export function ProfileScreen() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const user = useSelector(({ userData: { user } }: GlobalState) => user)

  return (
    <SafeAreaView style={styles.safeArea}>

      {user.caseOf({
        just   : user => (
          <ScrollView style={styles.mainContainer}>

            <Text style={styles.title}>{i18n.t('Profile - Account')}</Text>

            <Field title={i18n.t('Profile - Name')} value={`${user.firstname} ${user.lastname}`}/>

            <Separator style={{ marginVertical: 16 }}/>

            <Field title={i18n.t('Profile - Email')} value={user.email}/>

            <Separator style={{ marginVertical: 16 }}/>

            <Field title={i18n.t('Profile - DOB')} value={moment(user.dob).format('DD/MM/YYYY')}/>

            <Separator style={{ marginVertical: 16 }}/>

            <Field title={i18n.t('Profile - Height')} value={`${user.heightCm}cm`}/>

            <Separator style={{ marginVertical: 16 }}/>

            <Field title={i18n.t('Profile - Weight')} value={`${user.weightKg}kg`}/>

            <Separator style={{ marginVertical: 16 }}/>

            <Field title={i18n.t('Profile - Sex')} value={getSexString(user.sex)}/>

            <Separator style={{ marginVertical: 16 }}/>

            <Field title={i18n.t('Profile - Objectives')} editable={true}
                   onEditButtonPress={() => navigation.navigate('ProfileObjectives')}/>

            <Separator style={{ marginVertical: 16 }}/>

            <Field title={i18n.t('Profile - Password')} editable={true}/>

            <Text style={styles.title}>{i18n.t('Profile - Contact')}</Text>

            <Layout style={[styles.contactContainer, { marginBottom: 42 }]}>
              <Image source={enveloppeIcon} style={{
                height: 15,
                width : 18,
              }}/>
              <Text style={styles.subtitle}>{i18n.t('Profile - Contact us - email')}</Text>
            </Layout>

            <Layout style={styles.contactContainer}>
              <Image source={phoneIcon} style={{
                height: 16,
                width : 16,
              }}/>
              <Text style={styles.subtitle}>{i18n.t('Profile - Contact us - telephone')}</Text>
            </Layout>

            <Text style={styles.title}>{i18n.t('Profile - Legal')}</Text>

            <TouchableOpacity activeOpacity={.8} onPress={() => {
            }}>
              <Text style={[styles.subtitle, { marginBottom: 16 }]}>{i18n.t('Profile - Legal - Terms of use')}</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={.8} onPress={() => {
            }}>
              <Text style={[styles.subtitle, { marginBottom: 16 }]}>{i18n.t('Profile - Legal - Privacy')}</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={.8} onPress={() => {
            }}>
              <Text style={[styles.subtitle, { marginBottom: 31 }]}>{i18n.t('Profile - Legal - Liability')}</Text>
            </TouchableOpacity>

            <SummaxButton buttonStyle={ButtonStyle.GREEN} text={i18n.t('Sign out')}
                          onPress={() => dispatch({ type: ActionType.LOGOUT })}/>

            <Image source={summaxIcon} style={styles.summaxIcon}/>

            <Text style={[styles.bottomText, { marginBottom: 9 }]}>{`v${version}`}</Text>
            <Text style={styles.bottomText}>Copyright © 2019 Summax</Text>
          </ScrollView>
        ),
        nothing: () => <ErrorPage message={i18n.t('Profile - Error Page Message')}/>
      })}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea        : {
    backgroundColor: 'white',
    flex           : 1,
  },
  mainContainer   : {
    flex             : 1,
    paddingHorizontal: 16,
  },
  title           : {
    fontFamily  : 'aktivGroteskXBold',
    fontSize    : 30,
    lineHeight  : 30,
    marginBottom: 30,
    marginTop   : 47,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems   : 'center',
  },
  subtitle        : {
    fontFamily       : 'nexaXBold',
    fontSize         : 14,
    height           : 24,
    lineHeight       : 24,
    marginLeft       : 16,
    textAlignVertical: 'center',
  },
  summaxIcon      : {
    alignSelf   : 'center',
    height      : 20,
    marginBottom: 16,
    marginTop   : 30,
    width       : 101,
  },
  bottomText      : {
    fontFamily: 'nexaRegular',
    fontSize  : 14,
    lineHeight: 20,
    textAlign : 'center',
  },
})