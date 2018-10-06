import React from 'react'
import withData from '../lib/apollo/withData'

import Frame from '../components/Frame'

import FaqList from '../components/Faq/List'
import FaqForm from '../components/Faq/Form'

export default withData(() => (
  <Frame>
    <FaqList />
    <FaqForm />
  </Frame>
))
