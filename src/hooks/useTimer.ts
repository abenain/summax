import moment from 'moment'
import { useRef, useState } from 'react'
import { Maybe } from 'tsmonad'
import { NoOp } from '../utils'

export interface TimerConfig {
  countdown?: boolean
  countdownFromMs?: number
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

export function useTimer({ countdown, countdownFromMs } = {} as TimerConfig): [
  number,
  () => void,
  () => void,
  (newValueSeconds: number) => void
] {
  const latestTimeCapture = useRef(Maybe.nothing<moment.Moment>())
  const running = useRef(true)
  const animationFrameHandle = useRef(Maybe.nothing<number>())
  const internalValue = useRef(countdownFromMs ? countdownFromMs : 0)
  const [timerValue, setTimerValue] = useState(internalValue.current)

  function updateTimerValue() {
    const now = moment()
    const previousCapture = latestTimeCapture.current.valueOr(now)
    const timeDelta = moment.duration(now.diff(previousCapture)).asMilliseconds()

    internalValue.current = countdown ? internalValue.current - timeDelta : internalValue.current + timeDelta
    latestTimeCapture.current = Maybe.just(now)
    setTimerValue(internalValue.current)

    if (running.current) {
      animationFrameHandle.current = Maybe.just(requestAnimationFrame(updateTimerValue))
    }
  }

  function start() {
    running.current = true
    latestTimeCapture.current = Maybe.just(moment())

    animationFrameHandle.current = Maybe.just(requestAnimationFrame(updateTimerValue))
  }

  function stop() {
    running.current = false

    animationFrameHandle.current.caseOf({
      just   : handle => clearTimeout(handle),
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