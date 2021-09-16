import React, { Fragment } from 'react'
import Frame from '../../../components/Frame'
import Discussion from '../../../components/Discussion/Discussion'
import { withRouter } from 'next/router'
import { mediaQueries, In } from '@project-r/styleguide'
import { css } from 'glamor'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'

import { VOTING_COOP_201912_REPORT_SLUG } from '../constants'
import voteT from '../voteT'
import { Title } from '../text'
import Loader from '../../Loader'
import md from 'markdown-in-js'
import { mdComponents } from '../text'

const styles = {
  discussion: css({
    margin: '0 0 20px 0',
    [mediaQueries.lUp]: {
      margin: '30px 0'
    }
  })
}

const DISCUSSION_SLUG = VOTING_COOP_201912_REPORT_SLUG

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
              <Title>{vt('vote/201912/discussion/title')}</Title>
              {md(mdComponents)`
Während der [Abstimmung](/vote/dez19) vom 13. bis zum 23. Dezember 2019 möchten wir mit Ihnen diskutieren. Wenn Sie etwas genauer wissen möchten, Lob oder Kritik für uns haben: Wir freuen uns auf Ihren Beitrag.

 - Haben Sie Verständnisfragen?
 - Was können wir bei der nächsten Abstimmung besser machen?
 - Oder brauchen Sie technische Unterstützung beim Abstimmen?
              `}
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
  ${VOTING_COOP_201912_REPORT_SLUG}: voting(slug: "${VOTING_COOP_201912_REPORT_SLUG}") {
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
