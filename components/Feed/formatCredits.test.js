import formatCredits from './formatCredits'
import test from 'tape'

const fixture = [{
  title: 'simple',
  credits: [
    {
      'type': 'text',
      'value': '12.06.2018'
    }
  ],
  expected: [
    {
      'type': 'text',
      'value': '' // date removed
    }
  ]
},
{
  title: 'standard',
  credits: [
    {
      'type': 'text',
      'value': 'Von Marco Salvi, 12.06.2018 '
    }
  ],
  expected: [
    {
      'type': 'text',
      'value': 'Von Marco Salvi' // date removed
    }
  ]
},
{
  title: 'nopadding',
  credits: [
    {
      'type': 'text',
      'value': 'Von Marco Salvi, 1.6.2018 '
    }
  ],
  expected: [
    {
      'type': 'text',
      'value': 'Von Marco Salvi' // date removed
    }
  ]
},
{
  title: 'update',
  credits: [
    {
      'type': 'text',
      'value': ', 5.12.2017, Update: 06.12.2017'
    }
  ],
  expected: [
    {
      'type': 'text',
      'value': ', Update: 06.12.2017' // only publishDate removed
    }
  ]
},
{
  title: 'mixed',
  credits: [
    {
      'type': 'text',
      'value': 'Von '
    },
    {
      'children': [
        {
          'type': 'text',
          'value': 'Constantin Seibt'
        }
      ],
      'title': null,
      'type': 'link',
      'url': '/~cseibt'
    },
    {
      'type': 'text',
      'value': ', '
    },
    {
      'children': [
        {
          'type': 'text',
          'value': 'Anja Conzett'
        }
      ],
      'title': 'Anja Conzett',
      'type': 'link',
      'url': '/~acon'
    },
    {
      'type': 'text',
      'value': ', Gion-Mattias Durband, 12.06.2018'
    }
  ],
  expected: [
    {
      'type': 'text',
      'value': 'Von '
    },
    {
      'children': [
        {
          'type': 'text',
          'value': 'Constantin Seibt'
        }
      ],
      'title': null,
      'type': 'link',
      'url': '/~cseibt'
    },
    {
      'type': 'text',
      'value': ', '
    },
    {
      'children': [
        {
          'type': 'text',
          'value': 'Anja Conzett'
        }
      ],
      'title': 'Anja Conzett',
      'type': 'link',
      'url': '/~acon'
    },
    {
      'type': 'text',
      'value': ', Gion-Mattias Durband' // date removed
    }
  ]
}]

fixture.forEach(({ title, credits, expected }) => {
  test(`formatCredits.${title}`, assert => {
    assert.deepEqual(
      formatCredits(credits),
      expected
    )
    assert.end()
  })
})
