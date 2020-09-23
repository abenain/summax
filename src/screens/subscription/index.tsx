import { AntDesign, Entypo } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Layout } from '@ui-kitten/components'
import * as queryString from 'query-string'
import * as React from 'react'
import { useCallback, useState } from 'react'
import { Button, SafeAreaView, StatusBar, Text, View } from 'react-native'
import WebView, { WebViewMessageEvent } from 'react-native-webview'
import { useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { GlobalState } from '../../redux/store'

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
  const [subscriptionStatus, setSubscriptionStatus] = useState(Maybe.nothing())

  function handleOnMessage(event: WebViewMessageEvent) {
    if (event.nativeEvent.data === 'summaxSubscriptionSuccess') {
      setSubscriptionStatus(Maybe.just(true))
    } else {
      setSubscriptionStatus(Maybe.just(false))
    }
  }

  function navigateBackHome() {
    navigation.navigate('Home')
  }

  useFocusEffect(useCallback(() => {
    setSubscriptionStatus(Maybe.nothing())
  }, []))

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <StatusBar barStyle={'dark-content'} translucent={true}/>

      <Layout style={{ marginTop: 60, flex: 1 }}>
        {subscriptionStatus.caseOf({
          just   : status => (
            <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              {status ? (
                <View style={{ alignItems: 'center' }}>
                  <AntDesign name="checkcircleo" size={64} color="green"/>
                  <Text style={{ marginBottom: 32, marginTop: 16 }}>Vous êtes maintenant abonné à Summax Premium</Text>
                  <Button
                    onPress={navigateBackHome}
                    title="Retour à l'accueil"
                  />
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Entypo name="circle-with-cross" size={64} color="red"/>
                  <Text style={{ marginBottom: 32, marginTop: 16 }}>Votre paiement a échoué</Text>
                  <Button
                    onPress={navigateBackHome}
                    title="Retour à l'accueil"
                  />
                </View>
              )}
            </View>
          ),
          nothing: () => (
            <WebView
              onMessage={handleOnMessage}
              source={{ uri: getSummaxSubscriptionUrl(user.map(user => user.email)) }}
              style={{ flex: 1 }}
            />
          )
        })}
      </Layout>
    </SafeAreaView>
  )
}