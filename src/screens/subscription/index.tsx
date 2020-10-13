import { useNavigation } from '@react-navigation/native'
import { Layout } from '@ui-kitten/components'
import * as queryString from 'query-string'
import * as React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import WebView, { WebViewMessageEvent } from 'react-native-webview'
import { useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { GlobalState } from '../../redux/store'
import { fetchUserDataSequence } from '../../sequences'

const SUMMAX_SUBSCRIPTION_URL = 'https://www.summax.fr/offres'

function getSummaxSubscriptionUrl(email: Maybe<string>) {
  const queryParams = email.caseOf({
    just   : email => `?${queryString.stringify({ email })}`,
    nothing: () => ''
  })

  return `${SUMMAX_SUBSCRIPTION_URL}${queryParams}`
}

export function SubscriptionScreen() {

  const navigation = useNavigation()
  const user = useSelector(({ userData: { user } }: GlobalState) => user)

  function handleOnMessage(event: WebViewMessageEvent) {
    if (event.nativeEvent.data === 'summaxSubscriptionSuccess') {
      fetchUserDataSequence()
        .then(navigateBackHome)
    } else {
      navigateBackHome()
    }
  }

  function navigateBackHome() {
    navigation.navigate('Home')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <StatusBar barStyle={'dark-content'} translucent={true}/>

      <Layout style={{ marginTop: 60, flex: 1 }}>
        <WebView
          onMessage={handleOnMessage}
          source={{ uri: getSummaxSubscriptionUrl(user.map(user => user.email)) }}
          style={{ flex: 1 }}
        />
      </Layout>
    </SafeAreaView>
  )
}