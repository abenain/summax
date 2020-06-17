import { Layout, Text } from '@ui-kitten/components'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { Loading } from '../../components/Loading'

export function TrainingScreen(){
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000)
  }, [])

  if(isLoading){
    return <Loading />
  }

  return (
    <Layout style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
      <Text category={'h1'}>Training</Text>
    </Layout>
  )
}