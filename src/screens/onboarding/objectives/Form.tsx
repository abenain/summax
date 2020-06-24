import { Layout } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Image, StyleSheet } from 'react-native'
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

export interface FormHandle {
  getValues: () => ({
    hasWeightObjective: boolean,
    hasMuscleObjective: boolean,
    hasStressObjective: boolean,
    hasShapeObjective: boolean,
    hasAthleteObjective: boolean,
  })
}

export const Form = forwardRef(({}: {}, ref) => {
  const [hasWeightObjective, setHasWeightObjective] = useState(false)
  const [hasMuscleObjective, setHasMuscleObjective] = useState(false)
  const [hasStressObjective, setHasStressObjective] = useState(false)
  const [hasShapeObjective, setHasShapeObjective] = useState(false)
  const [hasAthleteObjective, setHasAthleteObjective] = useState(false)

  useImperativeHandle(ref, () => ({
    getValues: function () {
      return {
        hasWeightObjective,
        hasMuscleObjective,
        hasStressObjective,
        hasShapeObjective,
        hasAthleteObjective,
      }
    }
  }))

  return (
    <Layout style={styles.choiceTagContainer}>
      <ChoiceTag
        icons={{
          false: (<Image source={weightDarkIcon} style={{ height: 20, marginRight: 15, width: 20.4 }}/>),
          true : (<Image source={weightLightIcon} style={{ height: 20, marginRight: 15, width: 20.4 }}/>),
        }}
        onChange={value => setHasWeightObjective(value)}
        text={i18n.t('Onboarding - Objectives - Weight')}
        value={hasWeightObjective}/>
      <ChoiceTag
        icons={{
          false: (<Image source={muscleDarkIcon} style={{ height: 20.4, marginRight: 17, width: 18.5 }}/>),
          true : (<Image source={muscleLightIcon} style={{ height: 20.4, marginRight: 17, width: 18.5 }}/>),
        }}
        onChange={value => setHasMuscleObjective(value)}
        text={i18n.t('Onboarding - Objectives - Muscle')}
        value={hasMuscleObjective}/>
      <ChoiceTag
        icons={{
          false: (<Image source={balanceDarkIcon} style={{ height: 20.6, marginRight: 14, width: 20.6 }}/>),
          true : (<Image source={balanceLightIcon} style={{ height: 20.6, marginRight: 14, width: 20.6 }}/>),
        }}
        onChange={value => setHasStressObjective(value)}
        text={i18n.t('Onboarding - Objectives - Stress')}
        value={hasStressObjective}/>
      <ChoiceTag
        icons={{
          false: (<Image source={cardioDarkIcon} style={{ height: 20, marginRight: 13, width: 22 }}/>),
          true : (<Image source={cardioLightIcon} style={{ height: 20, marginRight: 13, width: 22 }}/>),
        }}
        onChange={value => setHasShapeObjective(value)}
        text={i18n.t('Onboarding - Objectives - Shape')}
        value={hasShapeObjective}/>
      <ChoiceTag
        icons={{
          false: (<Image source={athleteDarkIcon} style={{ height: 21, marginRight: 17, width: 18.2 }}/>),
          true : (<Image source={athleteLightIcon} style={{ height: 21, marginRight: 17, width: 18.2 }}/>),
        }}
        onChange={value => setHasAthleteObjective(value)}
        text={i18n.t('Onboarding - Objectives - Athlete')}
        value={hasAthleteObjective}/>
    </Layout>
  )
})

const styles = StyleSheet.create({
  choiceTagContainer: {
    height        : 318,
    justifyContent: 'space-between',
    marginTop     : 33,
  },
})