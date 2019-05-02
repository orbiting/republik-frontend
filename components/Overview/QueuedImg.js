import React, { useState, useEffect } from 'react'

const queue = []

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

const loadedSrcs = new Set()
const loadImage = src => {
  return new Promise(resolve => {
    const job = () => {
      const img = new window.Image()
      img.onerror = () => {
        resolve()
      }
      img.onload = () => {
        loadedSrcs.add(src)
        resolve()
      }
      img.src = src
    }
    queue.push(job)
    checkPending()
  }).then(() => {
    loadEnded()
  })
}

const useIsSrcReady = src => {
  const isLoaded = loadedSrcs.has(src)

  const [loadedSrc, setLoadedSrc] = useState(null)
  useEffect(() => {
    let ignore = false
    if (!isLoaded) {
      loadImage(src).then(() => {
        if (!ignore) {
          setLoadedSrc(src)
        }
      })
    }
    return () => {
      ignore = true
    }
  }, [src])

  return isLoaded || src === loadedSrc
}

const QueuedImg = ({ src, ...props }) => {
  const isSrcReady = useIsSrcReady(src)

  return isSrcReady
    ? <img {...props} src={src} />
    : null
}

export default QueuedImg
