const matchUserAgent = value => value && value.match(/RepublikApp/)

export const runInApp = process.browser && matchUserAgent(navigator.userAgent)
  ? callback => callback()
  : () => {}

const withNativeSupport = WrappedComponent => props => {
  const runningInApp = process.browser
    ? matchUserAgent(navigator.userAgent)
    : props.headers && matchUserAgent(props.headers.userAgent)

  return <WrappedComponent runningInApp={runningInApp} {...props} />
}

export default withNativeSupport
