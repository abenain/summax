import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'

export function MyWorkoutsScreen(){
  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category={'h1'}>My Workouts</Text>
    </Layout>
  )
}