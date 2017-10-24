const spec = [
  { n: 60, key: 'timeago/justNow' },
  { n: 60, key: 'timeago/minutes' },
  { n: 24, key: 'timeago/hours' },
  { n: 7, key: 'timeago/days' },
  { n: 365 / 7 / 12, key: 'timeago/months' },
  { n: 12, key: 'timeago/years' }
]

// diff is in seconds, positive.
export default (t, diff) => {
  let i = 0
  for (; diff >= spec[i].n && i < spec.length; i++) {
    diff /= spec[i].n
  }

  return t.pluralize(spec[Math.min(i, spec.length - 1)].key, {count: Math.floor(diff)})
}
