import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { ViewStyle } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { SummaxColors } from '../../colors'

export interface Props {
  color?: string
  progressRatio: number
  size: number
  strokeWidth?: number
  style?: ViewStyle
}

export function ProgressCircle({ color = 'white', progressRatio, size, strokeWidth = 1, style = {} }: Props) {
  const progress = Math.min(Math.max(0, progressRatio), 1)
  const radius = (size / 2) - (strokeWidth * 2)
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - progress * circumference

  return (
    <Layout style={[{
      alignItems: 'center',
      justifyContent: 'center',
      height: size,
      width: size,
    }, style]}>

      <Svg
        height={size}
        width={size}
        style={{position: 'absolute', top: 0, left: 0}}
      >
        <Circle
          stroke={SummaxColors.cloudyBlue}
          strokeWidth={strokeWidth}
          fill={'transparent'}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <Circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={[circumference, circumference]}
          strokeDashoffset={dashOffset}
          fill={'transparent'}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>

      <Text style={{
        fontFamily: 'nexaXBold',
        fontSize: 18,
        paddingTop: 5,
      }}>{`${Math.floor(progressRatio * 100)}%`}</Text>
    </Layout>
  )
}