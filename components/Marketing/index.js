import React, { Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import {
  Label,
  Container,
  P,
  RawHtml,
  mediaQueries,
  Interaction
} from '@project-r/styleguide'

import { countFormat } from '../../lib/utils/format'
import withT from '../../lib/withT'
import { Link, Router } from '../../lib/routes'

import { ListWithQuery } from '../Testimonial/List'

import { buttonStyles, sharedStyles } from './styles'

const query = gql`
query marketingMembershipStats {
  membershipStats {
    count
  }
}
`

const styles = {
  communityWidget: css({
    margin: '9px auto 0 auto',
    maxWidth: '974px',
    [mediaQueries.mUp]: {
      margin: '78px auto 0 auto'
    }
  })
}

const MarketingPage = ({ me, t, crowdfundingName, loading, data: { membershipStats }, ...props }) => {
  return (
    <Fragment>
      <Container>
        <h1 {...sharedStyles.headline}>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('marketing/title')
            }}
          />
        </h1>
        <P {...sharedStyles.lead}>{t('marketing/lead')}</P>
        <div {...sharedStyles.actions}>
          <div>
            <Link route='pledge'>
              <button {...buttonStyles.primary}>
                {t('marketing/join/button/label')}
              </button>
            </Link>
            <Label {...sharedStyles.signInLabel}>{
              t.elements(
                'marketing/signin',
                { link: <Link key='link' route={'signin'}>
                  <a>{t('marketing/signin/link') }</a>
                </Link>
                }
              )
            }</Label>
          </div>
          <Link route='preview'>
            <button {...buttonStyles.standard}>
              {t('marketing/preview/button/label')}
            </button>
          </Link>
        </div>
        {!loading && membershipStats && <div {...styles.communityWidget}>
          <Interaction.H2 {...sharedStyles.communityHeadline}>
            {t(
              'marketing/community/title',
              { count: countFormat(membershipStats.count) }
            )}
          </Interaction.H2>
          <ListWithQuery singleRow minColumns={3} first={6} onSelect={(id) => {
            Router.push(`/community?id=${id}`).then(() => {
              window.scrollTo(0, 0)
              return false
            })
          }} />
          <Interaction.P {...sharedStyles.communityLink}>
            <Link route='community'>
              <a>{t('marketing/community/link')}</a>
            </Link>
          </Interaction.P>
        </div>}
        <div {...sharedStyles.spacer} />
      </Container>
    </Fragment>
  )
}

export default compose(
  withT,
  graphql(query)
)(MarketingPage)
