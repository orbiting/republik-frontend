import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import { Link, Router } from '../../lib/routes'
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
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

import Frame from '../Frame'

import ActiveDiscussions from './ActiveDiscussions'
import DiscussionTitle from './DiscussionTitle'
import ArticleSearch from './ArticleSearch'
import LatestComments from './LatestComments'
import Discussion from '../Discussion/Discussion'

import {
  A,
  Button,
  Center,
  Interaction,
  Editorial,
  Label,
  mediaQueries,
  colors,
  InfoBoxListItem
} from '@project-r/styleguide'
import FontSizeSync from '../FontSize/Sync'
import FontSizeAdjust from '../FontSize/Adjust'

import { ListWithQuery as TestimonialList } from '../Testimonial/List'

const tabMq = '@media only screen and (min-width: 468px)'

const styles = {
  container: css({
    padding: '20px 15px 120px 15px',
    [mediaQueries.mUp]: {
      padding: '55px 0 120px 0'
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

class FeedbackPage extends Component {
  constructor(props, ...args) {
    super(props, ...args)

    this.state = {
      loading: false,
      searchValue: undefined
    }

    this.onChangeFromSearch = selectedObj => {
      const {
        router: { query }
      } = this.props
      if (!selectedObj) {
        return
      }
      const { discussionId, routePath, title } = selectedObj
      if (routePath) {
        Router.pushRoute(routePath)
        return
      }
      if (!discussionId || discussionId === query.id) {
        return
      }
      this.setState({
        searchValue: { text: title, value: selectedObj }
      })
      Router.pushRoute(
        'discussion',
        { id: discussionId, t: query.t },
        { shallow: true }
      )
    }

    this.onReset = () => {
      this.setState({
        searchValue: null
      })
    }
  }

  render() {
    const {
      t,
      me,
      router: { query }
    } = this.props
    const { searchValue } = this.state

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
      <Frame raw meta={pageMeta} formatColor={colors.primary}>
        <FontSizeSync />
        <Center {...styles.container}>
          {!tab && (
            <>
              <Interaction.Headline>{t('feedback/title')}</Interaction.Headline>
              <br />
              <WithMembership
                render={() => (
                  <>
                    <Interaction.P>{t('feedback/lead')}</Interaction.P>

                    <Editorial.UL compact>
                      <InfoBoxListItem>
                        <p>
                          <Link
                            route='discussion'
                            params={{ t: 'general' }}
                            passHref
                          >
                            <A>{t('feedback/link/general')}</A>
                          </Link>
                        </p>
                      </InfoBoxListItem>
                      <InfoBoxListItem>
                        <p>
                          <Link
                            route='format'
                            params={{ slug: 'debatte' }}
                            passHref
                          >
                            <A>{t('feedback/link/format')}</A>
                          </Link>
                        </p>
                      </InfoBoxListItem>
                    </Editorial.UL>
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
              <br />
              <FontSizeAdjust t={t} />
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
              <WithMembership
                render={() => (
                  <Fragment>
                    {/*<div {...styles.articleHeadline}>
                      <Interaction.H3>
                        {t('feedback/article/headline')}
                      </Interaction.H3>
                    </div>
                    <ArticleSearch
                      value={searchValue}
                      onChange={this.onChangeFromSearch}
                      onReset={this.onReset}
                    />*/}
                    <Interaction.H3 {...styles.h3}>
                      {t('feedback/activeDiscussions/label')}
                    </Interaction.H3>
                    <ActiveDiscussions
                      discussionId={activeDiscussionId}
                      first={5}
                      ignoreDiscussionId={GENERAL_FEEDBACK_DISCUSSION_ID}
                    />
                  </Fragment>
                )}
              />

              <Interaction.H3 {...styles.h3}>
                {t('marketing/community/title/plain')}
              </Interaction.H3>
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
                  <Interaction.H3 {...styles.h3}>
                    {t('feedback/latestComments/headline')}
                  </Interaction.H3>
                  <LatestComments />
                </Fragment>
              )}
            />
          )}
        </Center>
      </Frame>
    )
  }
}

export default compose(
  withMe,
  withT,
  withRouter
)(FeedbackPage)
