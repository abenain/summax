import moment from 'moment'
import { useCallback, useRef, useState } from 'react'
import { Maybe } from 'tsmonad'
import { NoOp } from '../utils'

export interface TimerConfig {
  countdown?: boolean
  countdownFromMs?: number
  onCountdownExpired?: () => void
}

function formatNumberValue(value: number) {
  return value.toString().padStart(2, '0')
}

export function format(durationMs: number) {
  const duration = moment.duration(durationMs)
  const formattedHours = formatNumberValue(duration.hours())
  const formattedMinutes = formatNumberValue(duration.minutes())
  const formattedSeconds = formatNumberValue(duration.seconds())
  return `${formattedHours} : ${formattedMinutes} : ${formattedSeconds}`
}

export function useTimer({ countdown, countdownFromMs, onCountdownExpired = NoOp } = {} as TimerConfig): [
  number,
  () => void,
  () => void,
  (newValueSeconds: number) => void
] {
  const latestTimeCapture = useRef(Maybe.nothing<moment.Moment>())
  const isRunning = useRef(true)
  const animationFrameHandle = useRef(Maybe.nothing<number>())
  const internalValue = useRef(countdownFromMs ? countdownFromMs : 0)
  const [timerValue, setTimerValue] = useState(internalValue.current)

  const notifyTimerExpired = useCallback(() => {
    onCountdownExpired()
  }, [onCountdownExpired])

  function updateTimerValue() {
    const now = moment()
    const previousCapture = latestTimeCapture.current.valueOr(now)
    const timeDelta = moment.duration(now.diff(previousCapture)).asMilliseconds()

    if (countdown) {
      internalValue.current = Math.max(internalValue.current - timeDelta, 0)
      if (internalValue.current === 0) {
        isRunning.current = false
        notifyTimerExpired()
      }
    } else {
      internalValue.current = internalValue.current + timeDelta
    }

    latestTimeCapture.current = Maybe.just(now)
    setTimerValue(internalValue.current)

    if (isRunning.current) {
      animationFrameHandle.current = Maybe.just(requestAnimationFrame(updateTimerValue))
    }
  }

  function start() {
    isRunning.current = true
    latestTimeCapture.current = Maybe.just(moment())

    animationFrameHandle.current = Maybe.just(requestAnimationFrame(updateTimerValue))
  }

  function stop() {
    isRunning.current = false

    animationFrameHandle.current.caseOf({
      just   : handle => cancelAnimationFrame(handle),
      nothing: NoOp
    })

    animationFrameHandle.current = Maybe.nothing()
  }

  function resetTo(newValueMs: number) {
    stop()

    internalValue.current = newValueMs
  }

  return [timerValue, start, stop, resetTo]
}