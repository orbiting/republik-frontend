export const getUtmParams = (query, defaults = {}) =>
  Object.keys(query)
    .filter(key => key.startsWith('utm_'))
    .reduce((acc, key) => Object.assign(acc, { [key]: query[key] }), defaults)
