import { Layout } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { NoOp } from '../../utils'

interface Props {
  children?: React.ReactNode
  onContinue?: () => void
}

export function BaseScreen({ children = null, onContinue = NoOp }: Props) {
  return (
    <Layout style={{ flex: 1, paddingHorizontal: 16 }}>

      <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
        {children}
      </Layout>

      <Layout style={{ alignSelf: 'stretch', height: 56 }}>
        <SummaxButton
          buttonStyle={ButtonStyle.GREEN}
          onPress={onContinue}
          text={i18n.t('Onboarding - Continue')}/>
      </Layout>

    </Layout>
  )
}