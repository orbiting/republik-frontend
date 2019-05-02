import React, { Component } from 'react'

const queue = []
const loadedSrcs = []

let running = 0
const concurrency = 10

const checkPending = () => {
  if (running < concurrency && queue.length) {
    queue.shift()()
    running += 1
  }
}
const loadEnded = () => {
  running -= 1
  checkPending()
}

class QueuedImg extends Component {
  constructor (props, ...args) {
    super(props, ...args)
    const alreadyLoaded = loadedSrcs.indexOf(props.src) !== -1
    this.state = {
      alreadyLoaded,
      shouldLoad: alreadyLoaded
    }
    if (!alreadyLoaded) {
      new Promise((resolve) => {
        queue.push(resolve)
      }).then(() => {
        this.setState({ shouldLoad: true })
      })
      checkPending()
    }
  }
  render () {
    const { shouldLoad, alreadyLoaded } = this.state
    const { onLoad, onError, ...props } = this.props

    return shouldLoad
      ? <img {...props} onLoad={event => {
        if (!alreadyLoaded) {
          loadedSrcs.push(props.src)
          loadEnded()
        }
        onLoad(event)
      }} onError={event => {
        if (!alreadyLoaded) {
          loadEnded()
        }
        onError(event)
      }} />
      : null
  }
}

export default QueuedImg
