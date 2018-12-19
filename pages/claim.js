import React from 'react'

import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import isEmail from 'validator/lib/isEmail'

import { maybeDecode } from '../lib/utils/base64u'
import ClaimMembership from '../components/Account/Memberships/Claim'
import Frame from '../components/Frame'
import withT from '../lib/withT'

const ALLOWED_CONTEXT = ['claim', 'access']

const Claim = ({ router: { query }, t }) => {
  let { context, email, code } = query

  context = ALLOWED_CONTEXT.includes(context) && context
  email = email && maybeDecode(email)
  email = email && isEmail(email) ? email : ''
  code =
    code && maybeDecode(code)
      .substr(0, 10) // Limit code to 10 chars
      .replace(/[^a-zA-Z0-9]/g, '') // Remove unknown (or unwanted) chars
      .trim()

  const meta = {
    title: t.first([
      `pages/claim/${context}/meta/title`,
      'pages/claim/meta/title'
    ]),
    description: t.first([
      `pages/claim/${context}/meta/description`,
      'pages/claim/meta/description'
    ])
  }

  return <Frame meta={meta}>
    <ClaimMembership
      context={context}
      email={email}
      voucherCode={code} />
  </Frame>
}

export default compose(withRouter, withT)(Claim)
