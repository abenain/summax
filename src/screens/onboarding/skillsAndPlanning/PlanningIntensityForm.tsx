import { Layout } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, StyleSheet } from 'react-native'
import { Maybe } from 'tsmonad'
import { PlanningIntensity } from '../../../types'
import { IntensityChoiceTag } from './IntensityChoiceTag'

const lowIcon = require('./low.png')
const lowSelectedIcon = require('./low-selected.png')
const mediumIcon = require('./medium.png')
const mediumSelectedIcon = require('./medium-selected.png')
const highIcon = require('./high.png')
const highSelectedIcon = require('./high-selected.png')

interface Props {
  onChange: (value: PlanningIntensity) => void
  value: Maybe<PlanningIntensity>
}

export function PlanningIntensityForm({ onChange, value }: Props) {

  return (
    <Layout style={styles.choiceTagContainer}>
      <IntensityChoiceTag
        icons={{
          false: <Image source={lowIcon} style={{ height: 54, width: 54 }}/>,
          true : <Image source={lowSelectedIcon} style={{ height: 54, width: 54 }}/>,
        }}
        onChange={() => onChange(PlanningIntensity.LOW)}
        text={i18n.t('Onboarding - Planning - Low')}
        value={value.caseOf({
          just   : intensity => intensity === PlanningIntensity.LOW,
          nothing: () => false
        })}/>
      <IntensityChoiceTag
        icons={{
          false: <Image source={mediumIcon} style={{ height: 54, width: 54 }}/>,
          true : <Image source={mediumSelectedIcon} style={{ height: 54, width: 54 }}/>,
        }}
        onChange={() => onChange(PlanningIntensity.MEDIUM)}
        text={i18n.t('Onboarding - Planning - Medium')}
        value={value.caseOf({
          just   : intensity => intensity === PlanningIntensity.MEDIUM,
          nothing: () => false
        })}/>
      <IntensityChoiceTag
        icons={{
          false: <Image source={highIcon} style={{ height: 54, width: 54 }}/>,
          true : <Image source={highSelectedIcon} style={{ height: 54, width: 54 }}/>,
        }}
        onChange={() => onChange(PlanningIntensity.INTENSE)}
        text={i18n.t('Onboarding - Planning - Intense')}
        value={value.caseOf({
          just   : intensity => intensity === PlanningIntensity.INTENSE,
          nothing: () => false
        })}/>
    </Layout>
  )
}

const styles = StyleSheet.create({
  choiceTagContainer: {
    flexDirection : 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
})