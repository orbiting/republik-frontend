import React from 'react'
import test from 'tape'
import { render } from '../../lib/utils/enzyme'
import { Item } from './Elements'

test('account elements', assert => {
  assert.plan(1)

  const wrapper = render(<Item createdAt={new Date(2018, 0, 15)} />)

  assert.equal(
    wrapper.text().indexOf('15. Januar 2018') !== -1,
    true,
    'renders formatted createdAt'
  )
})
