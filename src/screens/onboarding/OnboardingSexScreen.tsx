import { useNavigation } from '@react-navigation/native'
import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Switch, TextInput } from 'react-native'
import { SummaxColors } from '../../colors'
import { Sex } from '../../types'
import { BaseScreen } from './BaseScreen'

const manLightIcon = require('./sex/man-light.png')
const manDarkIcon = require('./sex/man-dark.png')
const womanLightIcon = require('./sex/woman-light.png')
const womanDarkIcon = require('./sex/woman-dark.png')

function getWomanIcon(selectedSex: Sex) {
  if (selectedSex === Sex.FEMALE) {
    return womanDarkIcon
  }

  return womanLightIcon
}

function getManIcon(selectedSex: Sex) {
  if (selectedSex === Sex.MALE) {
    return manDarkIcon
  }

  return manLightIcon
}

function getSex(checked: boolean) {
  if (checked) {
    return Sex.MALE
  }

  return Sex.FEMALE
}

export function OnboardingSexScreen() {
  const navigation = useNavigation()
  const [isMale, setIsMale] = useState(false)
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BaseScreen onContinue={() => navigation.navigate('OnboardingTarget')} progress={{ current: 1, total: 2 }}>

        <ScrollView style={{ flex: 1 }}>
          <Text style={styles.instructions}>
            {i18n.t('Onboarding - Sex - Instructions')}
          </Text>

          <Layout style={styles.sexSelectionIconsContainer}>
            <Image source={getWomanIcon(getSex(isMale))} style={styles.womanIcon} />
            <Image source={getManIcon(getSex(isMale))} style={styles.manIcon} />
          </Layout>

          <Layout style={styles.sexSelectionSwitchContainer}>
            <Text style={[styles.inputText, { marginRight: 18 }]}>{i18n.t('Sex - Female - Initials')}</Text>
            <Switch ios_backgroundColor={SummaxColors.lightGrey}
                    onValueChange={checked => setIsMale(checked)}
                    style={{ borderColor: SummaxColors.lightishGreen, borderWidth: 1 }}
                    thumbColor={SummaxColors.lightishGreen}
                    trackColor={{ false: SummaxColors.lightGrey, true: SummaxColors.darkGrey }}
                    value={isMale}/>
            <Text style={[styles.inputText, { marginLeft: 14 }]}>{i18n.t('Sex - Male - Initials')}</Text>
          </Layout>

          <Layout style={styles.heightAndWeightContainer}>
            <TextInput
              keyboardType={'number-pad'}
              onChangeText={setHeightCm}
              placeholder={i18n.t('Placeholder - Height')}
              placeholderTextColor={SummaxColors.blueGrey}
              style={[styles.input, styles.inputText, { marginRight: 16 }]}
              value={heightCm}
            />
            <TextInput
              keyboardType={'number-pad'}
              onChangeText={setWeightKg}
              placeholder={i18n.t('Placeholder - Weight')}
              placeholderTextColor={SummaxColors.blueGrey}
              style={[styles.input, styles.inputText]}
              value={weightKg}
            />
          </Layout>
        </ScrollView>

      </BaseScreen>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  instructions               : {
    color       : SummaxColors.dark,
    fontFamily  : 'nexaRegular',
    fontSize    : 14,
    lineHeight  : 20,
    marginBottom: 47,
    textAlign   : 'center',
  },
  sexSelectionIconsContainer : {
    flexDirection : 'row',
    justifyContent: 'center',
    marginBottom  : 53,
  },
  womanIcon                  : {
    height     : 246,
    marginRight: 30,
    width      : 63,
  },
  manIcon                    : {
    height: 246,
    width : 85,
  },
  sexSelectionSwitchContainer: {
    alignItems    : 'center',
    flexDirection : 'row',
    justifyContent: 'center',
    marginBottom  : 62,
  },
  inputText                  : {
    color     : SummaxColors.blueGrey,
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 20,
  },
  heightAndWeightContainer   : {
    alignItems    : 'center',
    flexDirection : 'row',
    justifyContent: 'space-between',
  },
  input                      : {
    backgroundColor  : SummaxColors.lightGrey,
    borderWidth      : 0,
    flex             : 1,
    height           : 48,
    paddingHorizontal: 16,
  },
})
