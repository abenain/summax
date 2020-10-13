import { Layout } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { Maybe } from 'tsmonad'
import { Skills } from '../../../types'
import { ChoiceTag } from './ChoiceTag'


interface Props {
  onChange: (value: Skills) => void
  value: Maybe<Skills>
}

export function SkillsForm({ onChange, value }: Props) {

  return (
    <Layout style={styles.choiceTagContainer}>
      <ChoiceTag
        onChange={() => onChange(Skills.BEGINNER)}
        text={i18n.t('Onboarding - Skills - Beginner')}
        value={value.caseOf({
          just: skills => skills === Skills.BEGINNER,
          nothing: () => false
        })}/>
      <ChoiceTag
        onChange={() => onChange(Skills.INTERMEDIATE)}
        text={i18n.t('Onboarding - Skills - Intermediate')}
        value={value.caseOf({
          just: skills => skills === Skills.INTERMEDIATE,
          nothing: () => false
        })}/>
      <ChoiceTag
        onChange={() => onChange(Skills.ATHLETE)}
        text={i18n.t('Onboarding - Skills - Athlete')}
        value={value.caseOf({
          just: skills => skills === Skills.ATHLETE,
          nothing: () => false
        })}/>
    </Layout>
  )
}

const styles = StyleSheet.create({
  choiceTagContainer: {
    height        : 188,
    justifyContent: 'space-between',
    marginTop     : 33,
  },
})