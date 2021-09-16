import React, { Fragment } from 'react'
import Frame from '../../../components/Frame'
import Discussion from '../../../components/Discussion/Discussion'
import { withRouter } from 'next/router'
import { mediaQueries } from '@project-r/styleguide'
import { css } from 'glamor'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'

import { VOTING_COOP_201907_BUDGET_SLUG } from '../constants'
import voteT from '../voteT'
import { Body, Section, Title } from '../text'
import Loader from '../../Loader'

const styles = {
  discussion: css({
    margin: '0 0 20px 0',
    [mediaQueries.lUp]: {
      margin: '30px 0'
    }
  })
}

const DISCUSSION_SLUG = VOTING_COOP_201907_BUDGET_SLUG

const DiscussionPage = ({ router, data, vt }) => {
  const meta = {
    title: vt('info/title'),
    description: vt('info/description')
  }

  return (
    <Frame meta={meta}>
      <Loader
        loading={data.loading}
        error={data.error}
        render={() => {
          const discussionId =
            data[DISCUSSION_SLUG] && data[DISCUSSION_SLUG].discussion.id
          return (
            <Fragment>
              <Title>{vt('vote/201907/discussion/title')}</Title>
              <Section>
                <Body dangerousHTML={vt('vote/201907/discussion/intro')} />
              </Section>
              <div {...styles.discussion}>
                <Discussion
                  discussionId={discussionId}
                  focusId={router.query.focus}
                  mute={!!router.query.mute}
                />
              </div>
            </Fragment>
          )
        }}
      />
    </Frame>
  )
}

const query = gql`
  query discussionPage {
  ${VOTING_COOP_201907_BUDGET_SLUG}: voting(slug: "${VOTING_COOP_201907_BUDGET_SLUG}") {
    id
    discussion {
      id
      comments {
        id
        totalCount
      }
    }
   }
  }
`

export default compose(voteT, withRouter, graphql(query))(DiscussionPage)
