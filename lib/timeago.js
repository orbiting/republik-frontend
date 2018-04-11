const specsAgo = [
  { n: 60, key: 'timeago/justNow' },
  { n: 60, key: 'timeago/minutes' },
  { n: 24, key: 'timeago/hours' },
  { n: 7, key: 'timeago/days' },
  { n: 365 / 7 / 12, key: 'timeago/weeks' },
  { n: 12, key: 'timeago/months', fn: 'round' },
  { n: 10, key: 'timeago/years' }
]

const specsAhead = [
  { n: 60, key: 'timeAhead/seconds' },
  { n: 60, key: 'timeAhead/minutes' },
  { n: 24, key: 'timeAhead/hours' },
  { n: 7, key: 'timeAhead/days' },
  { n: 365 / 7 / 12, key: 'timeAhead/weeks' },
  { n: 12, key: 'timeAhead/months', fn: 'round' },
  { n: 10, key: 'timeAhead/years' }
]

// diff is in seconds, positive (time ago) or negative (time ahead).
export default (t, diff) => {
  const specs = diff >= 0 ? specsAgo : specsAhead
  diff = Math.abs(diff)
  let i = 0
  for (; diff >= specs[i].n && i < specs.length; i++) {
    diff /= specs[i].n
  }

  const spec = specs[Math.min(i, specs.length - 1)]
  return t.pluralize(
    spec.key,
    {
      count: Math[spec.fn || 'floor'](diff)
    }
  )
}
