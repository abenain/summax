import moment from 'moment'
import { useCallback, useRef, useState } from 'react'
import { Maybe } from 'tsmonad'
import { NoOp } from '../utils'

export interface TimerConfig {
  countdown?: boolean
  initialValueMs?: number
  notificationIntervalMs?: number
  onCountdownExpired?: () => void
  onIntervalElapsed?: () => void
}

export function format(durationMs: number) {
  const duration = moment.duration(durationMs)
  return `${Math.floor(duration.asSeconds())} "`
}

export function useTimer({ countdown, initialValueMs, notificationIntervalMs, onCountdownExpired = NoOp, onIntervalElapsed = NoOp } = {} as TimerConfig): [
  number,
  () => void,
  () => void,
  (newValueSeconds: number) => void
] {
  const latestTimeCapture = useRef(Maybe.nothing<moment.Moment>())
  const nbElapsedPeriods = useRef(0)
  const isRunning = useRef(true)
  const animationFrameHandle = useRef(Maybe.nothing<number>())
  const internalValue = useRef(initialValueMs ? initialValueMs : 0)
  const [timerValue, setTimerValue] = useState(internalValue.current)

  const notifyTimerExpired = useCallback(() => {
    if (onCountdownExpired && typeof onCountdownExpired === 'function') {
      onCountdownExpired()
    }
  }, [onCountdownExpired])

  const notifyIntervalElapsed = useCallback(() => {
    if (onIntervalElapsed && typeof onIntervalElapsed === 'function') {
      onIntervalElapsed()
    }
  }, [onIntervalElapsed])

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

    if (notificationIntervalMs) {
      const previousNbElapsedPeriods = nbElapsedPeriods.current
      nbElapsedPeriods.current = Math.floor(internalValue.current / notificationIntervalMs)

      if (nbElapsedPeriods.current > previousNbElapsedPeriods) {
        notifyIntervalElapsed()
      }
    }

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
    setTimerValue(internalValue.current)
  }

  return [timerValue, start, stop, resetTo]
}