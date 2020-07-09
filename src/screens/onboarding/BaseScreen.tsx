import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { SummaxColors } from '../../colors'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { NoOp } from '../../utils'

interface Props {
  children?: React.ReactNode
  onContinue?: () => void
  progress: {
    current: number
    total: number
  }
}

export function BaseScreen({ children = null, onContinue = NoOp, progress: {current, total} }: Props) {
  return (
    <Layout style={{ flex: 1, paddingHorizontal: 16 }}>

      <Layout style={{ flex: 1 }}>

        <Text style={{
          alignSelf: 'center',
          color: SummaxColors.blueGrey,
          fontFamily: 'nexaRegular',
          fontSize: 12,
          lineHeight: 16,
          marginBottom: 16,
          marginTop: 26,
        }}>
          {i18n.t('Onboarding - Progress', {current, total})}
        </Text>

        {children}

      </Layout>

      <Layout style={{ alignSelf: 'stretch', height: 56, marginBottom: 16, }}>
        <SummaxButton
          buttonStyle={ButtonStyle.GREEN}
          onPress={onContinue}
          text={i18n.t('Onboarding - Continue')}/>
      </Layout>

    </Layout>
  )
}