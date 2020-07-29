import fetch from 'isomorphic-unfetch'

let lastError

export const reportError = (context, error) => {
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
