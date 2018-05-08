const urlDecode = base64u =>
  `${base64u}${'==='.slice((base64u.length + 3) % 4)}`
    .replace(/-/g, '+')
    .replace(/_/g, '/')

const urlEncode = string => string
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '')

export const decode = base64u =>
  typeof window === 'object'
    ? window.atob(urlDecode(base64u))
    : Buffer.from(urlDecode(base64u), 'base64').toString('utf8')

export const encode = string => urlEncode(
  typeof window === 'object'
    ? window.btoa(string)
    : Buffer.from(string, 'utf8').toString('base64')
)

export const match = base64u => /^[A-Za-z0-9\-_]+$/.test(base64u)
