export default (storeKey) => {
  const readStore = () => {
    let content
    try {
      content = JSON.parse(
        window.localStorage.getItem(storeKey)
      ) || {}
    } catch (e) {
      content = null
    }
    return content
  }
  const supported = !!readStore()
  if (!supported) {
    return {
      get: () => {},
      set: () => {},
      supported
    }
  }

  return {
    get: key => readStore()[key],
    set: (key, value) => {
      try {
        window.localStorage.setItem(
          storeKey,
          JSON.stringify({
            ...readStore(),
            [key]: value
          })
        )
      } catch (e) {

      }
    },
    supported
  }
}
