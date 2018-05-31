// TODO: Add `navigator.userAgent.match(/RepublikApp/)` check when implementing userAgent
const runInApp = process.browser
  ? callback => callback()
  : () => {}

export default runInApp
