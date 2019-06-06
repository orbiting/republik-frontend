import test from 'tape'
import timeduration from './timeduration'
import { t } from './withT'

[
  [
    'now', // test name
    new Date(2018, 0, 11), // "now"
    new Date(2018, 0, 11), // date to compare now with
    '0s' // expected return string
  ],
  [
    'minutes',
    new Date(2018, 0, 11, 0, 10, 0),
    new Date(2018, 0, 11, 0, 0, 0),
    '10m'
  ],
  [
    'hour',
    new Date(2018, 0, 11, 1, 0, 0),
    new Date(2018, 0, 11, 0, 0, 0),
    '1h'
  ],
  [
    'days',
    new Date(2018, 0, 13, 0, 0, 0),
    new Date(2018, 0, 11, 0, 0, 0),
    '2t'
  ],
  [
    'week',
    new Date(2018, 0, 18, 0, 0, 0),
    new Date(2018, 0, 11, 0, 0, 0),
    '1w'
  ],
  [
    'months',
    new Date(2018, 2, 11, 0, 0, 0),
    new Date(2018, 0, 11, 0, 0, 0),
    '8w'
  ],
  [
    '7 months ago',
    new Date(2018, 0, 12),
    new Date(2017, 4, 31),
    '32w'
  ],
  [
    'a year ago',
    new Date(2018, 0, 11),
    new Date(2017, 0, 1),
    '1j'
  ],
  [
    '3 years ago',
    new Date(2018, 0, 11),
    new Date(2015, 0, 11),
    '3j'
  ],
  [
    '11 years ago',
    new Date(2018, 0, 11),
    new Date(2007, 0, 11),
    '11j'
  ]
].map(([title, now, date, expected]) => {
  test(`timeduration.${title}`, assert => {
    assert.equal(
      timeduration(t, (now - date) / 1000),
      expected
    )
    assert.end()
  })
})
