export default function formatCredits (credits) {
  return credits.map(c => {
    if (c.type === 'text') {
      const value = c.value.replace(/(,\s|^)\d{1,2}\.\d{1,2}\.\d{4}\s?/g, '')
      return {
        ...c,
        value
      }
    } else {
      return c
    }
  }
  )
}
