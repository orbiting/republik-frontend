import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import Frame from '../components/Frame'
import Trial from '../components/Trial/Page'
import withT from '../lib/withT'
import { CDN_FRONTEND_BASE_URL, PUBLIC_BASE_URL } from '../lib/constants'

import isEmail from 'validator/lib/isEmail'
import * as base64u from '../lib/utils/base64u'

const Page = ({ router, t }) => {
  const { campaign, email } = router.query
  let initialEmail = email

  if (initialEmail !== undefined) {
    try {
      if (base64u.match(initialEmail)) {
        initialEmail = base64u.decode(initialEmail)
      }
    } catch (e) {}

    if (!isEmail(initialEmail)) {
      initialEmail = ''
    }
  }

  const meta = {
    pageTitle: t.first([
      `trial/meta/${campaign}/pageTitle`,
      'trial/meta/pageTitle'
    ]),
    title: t.first([`trial/meta/${campaign}/title`, 'trial/meta/title']),
    description: t.first([
      `trial/meta/${campaign}/description`,
      'trial/meta/description'
    ]),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
    url: `${PUBLIC_BASE_URL}${router.pathname}`
  }

  return (
    <Frame meta={meta}>
      <Trial initialEmail={initialEmail} />
    </Frame>
  )
}

export default compose(withRouter, withT)(Page)
