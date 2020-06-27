import { Layout } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, StyleSheet } from 'react-native'
import { Objectives } from '../../../types'
import { ChoiceTag } from './ChoiceTag'

const athleteDarkIcon = require('./athlete-dark.png')
const athleteLightIcon = require('./athlete-light.png')
const balanceDarkIcon = require('./balance-dark.png')
const balanceLightIcon = require('./balance-light.png')
const cardioDarkIcon = require('./cardio-dark.png')
const cardioLightIcon = require('./cardio-light.png')
const muscleDarkIcon = require('./muscle-dark.png')
const muscleLightIcon = require('./muscle-light.png')
const weightDarkIcon = require('./weight-dark.png')
const weightLightIcon = require('./weight-light.png')

interface Props {
  onChange: (value: Objectives[]) => void
  values: Objectives[]
}

function updateValues(values: Objectives[], objective: Objectives, state: boolean) {
  if (!state) {
    return values.filter(value => value !== objective)
  }

  return [objective].concat(values)
}

export function Form({ onChange, values }: Props) {

  return (
    <Layout style={styles.choiceTagContainer}>
      <ChoiceTag
        icons={{
          false: (<Image source={weightDarkIcon} style={{ height: 20, marginRight: 15, width: 20.4 }}/>),
          true : (<Image source={weightLightIcon} style={{ height: 20, marginRight: 15, width: 20.4 }}/>),
        }}
        onChange={selected => onChange(updateValues(values, Objectives.WEIGHT, selected))}
        text={i18n.t('Onboarding - Objectives - Weight')}
        value={values.some(val => val === Objectives.WEIGHT)}/>
      <ChoiceTag
        icons={{
          false: (<Image source={muscleDarkIcon} style={{ height: 20.4, marginRight: 17, width: 18.5 }}/>),
          true : (<Image source={muscleLightIcon} style={{ height: 20.4, marginRight: 17, width: 18.5 }}/>),
        }}
        onChange={selected => onChange(updateValues(values, Objectives.MUSCLE, selected))}
        text={i18n.t('Onboarding - Objectives - Muscle')}
        value={values.some(val => val === Objectives.MUSCLE)}/>
      <ChoiceTag
        icons={{
          false: (<Image source={balanceDarkIcon} style={{ height: 20.6, marginRight: 14, width: 20.6 }}/>),
          true : (<Image source={balanceLightIcon} style={{ height: 20.6, marginRight: 14, width: 20.6 }}/>),
        }}
        onChange={selected => onChange(updateValues(values, Objectives.BALANCE, selected))}
        text={i18n.t('Onboarding - Objectives - Stress')}
        value={values.some(val => val === Objectives.BALANCE)}/>
      <ChoiceTag
        icons={{
          false: (<Image source={cardioDarkIcon} style={{ height: 20, marginRight: 13, width: 22 }}/>),
          true : (<Image source={cardioLightIcon} style={{ height: 20, marginRight: 13, width: 22 }}/>),
        }}
        onChange={selected => onChange(updateValues(values, Objectives.SHAPE, selected))}
        text={i18n.t('Onboarding - Objectives - Shape')}
        value={values.some(val => val === Objectives.SHAPE)}/>
      <ChoiceTag
        icons={{
          false: (<Image source={athleteDarkIcon} style={{ height: 21, marginRight: 17, width: 18.2 }}/>),
          true : (<Image source={athleteLightIcon} style={{ height: 21, marginRight: 17, width: 18.2 }}/>),
        }}
        onChange={selected => onChange(updateValues(values, Objectives.ATHLETE, selected))}
        text={i18n.t('Onboarding - Objectives - Athlete')}
        value={values.some(val => val === Objectives.ATHLETE)}/>
    </Layout>
  )
}

const styles = StyleSheet.create({
  choiceTagContainer: {
    height        : 318,
    justifyContent: 'space-between',
    marginTop     : 33,
  },
})