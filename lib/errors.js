import fetch from 'isomorphic-unfetch'

let lastError

export const reportError = (context, error) => {
  // do not track server side
  if (typeof window === 'undefined') {
    return
  }
  // avoid double reporting from window.onerror
  if (lastError === error) {
    return
  }
  fetch('/api/reportError', {
    method: 'POST',
    body: `${context}\n${error}`
  })
  lastError = error
}
