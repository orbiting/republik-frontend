import React from 'react'
import test from 'tape'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Me } from '../Me'

configure({ adapter: new Adapter() })

test('utils.createActionButton', assert => {
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
