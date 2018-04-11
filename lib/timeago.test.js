import test from 'tape'
import timeago from './timeago'
import { t } from './withT'

[
  [
    'now',
    new Date(2018, 0, 11),
    new Date(2018, 0, 11),
    'gerade eben'
  ],
  [
    'minutes',
    new Date(2018, 0, 11, 0, 10, 0),
    new Date(2018, 0, 11, 0, 0, 0),
    'vor 10 Minuten'
  ],
  [
    'hour',
    new Date(2018, 0, 11, 1, 0, 0),
    new Date(2018, 0, 11, 0, 0, 0),
    'vor einer Stunde'
  ],
  [
    'days',
    new Date(2018, 0, 13, 0, 0, 0),
    new Date(2018, 0, 11, 0, 0, 0),
    'vor 2 Tagen'
  ],
  [
    'week',
    new Date(2018, 0, 18, 0, 0, 0),
    new Date(2018, 0, 11, 0, 0, 0),
    'vor einer Woche'
  ],
  [
    'months',
    new Date(2018, 2, 11, 0, 0, 0),
    new Date(2018, 0, 11, 0, 0, 0),
    'vor 2 Monaten'
  ],
  [
    'the case that lead to the bug discovery',
    new Date(2018, 0, 12),
    new Date(2017, 4, 31),
    'vor 7 Monaten'
  ],
  [
    'second ahead',
    new Date(2018, 0, 11, 0, 0, 0),
    new Date(2018, 0, 11, 0, 0, 1),
    'in einer Sekunde'
  ],
  [
    'seconds ahead',
    new Date(2018, 0, 11, 0, 0, 0),
    new Date(2018, 0, 11, 0, 0, 50),
    'in 50 Sekunden'
  ],
  [
    'minute ahead',
    new Date(2018, 0, 11, 0, 0, 0),
    new Date(2018, 0, 11, 0, 1, 0),
    'in einer Minute'
  ],
  [
    'minutes ahead',
    new Date(2018, 0, 11, 0, 0, 0),
    new Date(2018, 0, 11, 0, 10, 0),
    'in 10 Minuten'
  ],
  [
    'hour ahead',
    new Date(2018, 0, 11, 0, 0, 0),
    new Date(2018, 0, 11, 1, 0, 0),
    'in einer Stunde'
  ],
  [
    'days ahead',
    new Date(2018, 0, 11, 0, 0, 0),
    new Date(2018, 0, 13, 0, 0, 0),
    'in 2 Tagen'
  ],
  [
    'week ahead',
    new Date(2018, 0, 11, 0, 0, 0),
    new Date(2018, 0, 18, 0, 0, 0),
    'in einer Woche'
  ],
  [
    'month ahead',
    new Date(2018, 0, 11, 0, 0, 0),
    new Date(2018, 1, 11, 0, 0, 0),
    'in einem Monat'
  ],
  [
    '7 months ahead',
    new Date(2017, 4, 31),
    new Date(2018, 0, 12),
    'in 7 Monaten'
  ],
  [
    '1 year ahead',
    new Date(2017, 4, 31),
    new Date(2018, 5, 1),
    'in einem Jahr'
  ]
].map(([title, now, date, expected]) => {
  test(`timeago.${title}`, assert => {
    assert.equal(
      timeago(t, (now - date) / 1000),
      expected
    )
    assert.end()
  })
})
