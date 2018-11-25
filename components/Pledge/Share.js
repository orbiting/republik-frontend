import React, { Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { PUBLIC_BASE_URL, ASSETS_SERVER_BASE_URL } from '../../lib/constants'
import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import ActionBar from '../ActionBar'

import {
  Interaction
} from '@project-r/styleguide'

const { P } = Interaction

const Share = ({ pkg, statement, me, t }) => {
  const packagePlease = statement && t(`statement/share/${pkg}/please`, undefined, '')

  const actionProps = !statement
    ? {
      url: PUBLIC_BASE_URL,
      title: t('merci/share/title'),
      tweet: t('merci/share/tweetTemplate'),
      emailSubject: t('merci/share/emailSubject'),
      emailBody: t('merci/share/emailBody', {
        url: PUBLIC_BASE_URL,
        backerName: me ? me.name : ''
      }),
      emailAttachUrl: false
    }
    : {
      url: packagePlease
        ? `${PUBLIC_BASE_URL}/angebote?package=${pkg}&ref=${statement.id}&utm_campaign=${pkg}-STATEMENTS&utm_content=${statement.id}`
        : `${PUBLIC_BASE_URL}/community?id=${statement.id}`,
      title: t.first([
        `statement/share/${pkg}/title`,
        `statement/share/title`
      ], statement),
      emailSubject: t.first([
        `statement/share/${pkg}/title`,
        `statement/share/title`
      ], statement),
      emailBody: t.first([
        `statement/share/${pkg}/emailBody`,
        `statement/share/emailBody`
      ], {
        url: `${PUBLIC_BASE_URL}/angebote?package=${pkg}`,
        backerName: me ? me.name : ''
      }, '') || undefined,
      emailAttachUrl: !t.first([
        `statement/share/${pkg}/emailBody`,
        `statement/share/emailBody`
      ], undefined, false),
      download: `${ASSETS_SERVER_BASE_URL}/render?width=1200&height=628&updatedAt=${encodeURIComponent(statement.updatedAt)}&url=${encodeURIComponent(`${PUBLIC_BASE_URL}/community?share=${statement.id}${pkg ? `&package=${pkg}` : ''}`)}`,
      shareOverlayTitle: t('statement/share/overlayTitle', statement)
    }

  return (
    <Fragment>
      <P>
        {packagePlease || t('statement/share/please')}
      </P>
      <br />
      <ActionBar {...actionProps} />
    </Fragment>
  )
}

const shareRefQuery = gql`
query statementsShareRef($statementId: String!) {
  statements(focus: $statementId, first: 1) {
    nodes {
      id
      name
      updatedAt
    }
  }
}`

export default compose(
  withT,
  withMe,
  graphql(shareRefQuery, {
    skip: props => !props.statementId,
    props: ({ data }) => {
      return {
        statement: data.statements &&
          data.statements.nodes &&
          data.statements.nodes[0]
      }
    }
  })
)(Share)
