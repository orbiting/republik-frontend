import {easeCubicOut} from 'd3-ease'
import {timer} from 'd3-timer'
import {interpolateNumber} from 'd3-interpolate'

let scrollTimer

export const scrollIt = (
  destination,
  duration = 200
) => {
  if (scrollTimer) {
    scrollTimer.stop()
  }
  const n = interpolateNumber(window.pageYOffset, destination)
  scrollTimer = timer(elapsed => {
    const t = easeCubicOut(Math.min(elapsed / duration, 1))

    window.scroll(0, Math.round(n(t)))

    if (t >= 1) {
      scrollTimer.stop()
    }
  })
}
