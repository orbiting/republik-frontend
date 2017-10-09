import React from 'react'
import test from 'tape'
import { shallow } from '../../lib/utils/enzyme'
import { Me } from '../Me'

test('components.me', assert => {
  assert.plan(1)

  const wrapper = shallow(
    <Me
      me={{name: 'Foo'}}
      t={() => 'Bar'}
    />
  )

  assert.equal(
    wrapper.find('H1').exists(),
    true,
    'has an H1'
  )
})
