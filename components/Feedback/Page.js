import React, { Fragment } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import { Link } from '../../lib/routes'
import {
  UnauthorizedMessage,
  WithMembership,
  WithoutMembership
} from '../Auth/withMembership'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'

import {
  CDN_FRONTEND_BASE_URL,
  GENERAL_FEEDBACK_DISCUSSION_ID
} from '../../lib/constants'

import Frame from '../Frame'

import ActiveDiscussions from './ActiveDiscussions'
import DiscussionTitle from './DiscussionTitle'
import LatestComments from './LatestComments'
import Discussion from '../Discussion/Discussion'
import DiscussionIcon from '../Icons/Discussion'
import ActionBar from '../ActionBar'
import FontSizeSync from '../FontSize/Sync'

import {
  A,
  Center,
  Interaction,
  Editorial,
  mediaQueries,
  colors
} from '@project-r/styleguide'

import { ListWithQuery as TestimonialList } from '../Testimonial/List'

const tabMq = '@media only screen and (min-width: 468px)'

const styles = {
  container: css({
    // aligned with article view
    paddingTop: 15,
    paddingBottom: 120,
    [mediaQueries.mUp]: {
      paddingTop: 25
    }
  }),
  h3: css({
    marginTop: 30,
    [mediaQueries.mUp]: {
      marginTop: 60
    },
    marginBottom: 20
  })
}

const H3 = ({ style, children }) => (
  <div {...styles.h3} style={style}>
    <Interaction.H3>{children}</Interaction.H3>
  </div>
)

const FeedbackPage = props => {
  const {
    t,
    me,
    router: { query }
  } = props

  const tab = query.t

  const activeDiscussionId =
    tab === 'general'
      ? GENERAL_FEEDBACK_DISCUSSION_ID
      : tab === 'article' && query.id

  // meta tags for discussions are rendered in Discussion/Commments.js
  const pageMeta = activeDiscussionId
    ? undefined
    : {
        title: t('pages/feedback/title'),
        image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
      }

  return (
    <Frame
      hasOverviewNav={!tab}
      raw
      meta={pageMeta}
      formatColor={colors.primary}
      stickySecondaryNav={!tab}
      colorSchemeKey='auto'
    >
      {!!tab && <FontSizeSync />}
      <Center>
        <div {...styles.container}>
          {!tab && (
            <>
              <Interaction.Headline>{t('feedback/title')}</Interaction.Headline>
              <br />
              <WithMembership
                render={() => (
                  <>
                    <Interaction.P>{t('feedback/lead')}</Interaction.P>
                    <Interaction.P style={{ marginTop: 10 }}>
                      <Link
                        route='discussion'
                        params={{ t: 'general' }}
                        passHref
                      >
                        <A>{t('feedback/link/general')}</A>
                      </Link>
                    </Interaction.P>
                  </>
                )}
              />
            </>
          )}
          {!!tab && (
            <div style={{ marginBottom: 30 }}>
              <Editorial.Format color={colors.primary}>
                <Link route='discussion' passHref>
                  <a style={{ color: 'inherit', textDecoration: 'none' }}>
                    {t('feedback/title')}
                  </a>
                </Link>
              </Editorial.Format>
              <Interaction.H1>
                {tab === 'article' && (
                  <DiscussionTitle discussionId={activeDiscussionId} />
                )}
                {tab === 'general' && t('feedback/general/title')}
              </Interaction.H1>
              {tab === 'general' && (
                <Interaction.P style={{ marginTop: 10 }}>
                  {t('feedback/general/lead')}
                </Interaction.P>
              )}
              <br />
              <ActionBar discussion={activeDiscussionId} fontSize />
            </div>
          )}
          <WithoutMembership
            render={() => (
              <>
                <UnauthorizedMessage
                  {...{
                    me,
                    unauthorizedTexts: {
                      title: ' ',
                      description: t.elements('feedback/unauthorized', {
                        buyLink: (
                          <Link key='pledge' route='pledge' passHref>
                            <A>{t('feedback/unauthorized/buyText')}</A>
                          </Link>
                        )
                      })
                    }
                  }}
                />
                <br />
                <br />
                <br />
              </>
            )}
          />
          {!tab && (
            <>
              <H3>{t('marketing/community/title/plain')}</H3>
              <TestimonialList
                singleRow
                minColumns={3}
                first={5}
                share={false}
              />
              <div style={{ marginTop: 10 }}>
                <Link route='community' passHref>
                  <A>{t('marketing/community/link')}</A>
                </Link>
              </div>
              <WithMembership
                render={() => (
                  <Fragment>
                    <H3
                      style={{
                        position: 'relative',
                        paddingRight: 40
                      }}
                    >
                      {t('feedback/activeDiscussions/label')}
                      <span style={{ position: 'absolute', right: 0, top: -1 }}>
                        <DiscussionIcon size={24} fill={colors.primary} />
                      </span>
                    </H3>
                    <ActiveDiscussions first={5} />
                  </Fragment>
                )}
              />
            </>
          )}
          {activeDiscussionId && (
            <Discussion
              discussionId={activeDiscussionId}
              focusId={query.focus}
              mute={query && !!query.mute}
              meta
            />
          )}
          {!tab && (
            <WithMembership
              render={() => (
                <Fragment>
                  <H3>{t('feedback/latestComments/headline')}</H3>
                  <LatestComments />
                </Fragment>
              )}
            />
          )}
        </div>
      </Center>
    </Frame>
  )
}

export default compose(withMe, withT, withRouter)(FeedbackPage)
