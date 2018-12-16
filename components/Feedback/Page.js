import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import { Router } from '../../lib/routes'
import { WithMembership } from '../Auth/withMembership'
import withT from '../../lib/withT'

import {
  CDN_FRONTEND_BASE_URL,
  GENERAL_FEEDBACK_DISCUSSION_ID
} from '../../lib/constants'
import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  ZINDEX_CONTENT
} from '../constants'

import Frame from '../Frame'

import ActiveDiscussions from './ActiveDiscussions'
import ArticleDiscussionHeadline from './ArticleDiscussionHeadline'
import ArticleSearch from './ArticleSearch'
import LatestComments from './LatestComments'
import Discussion from '../Discussion/Discussion'

import {
  Button,
  Center,
  Interaction,
  Label,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  container: css({
    padding: '20px 15px 120px 15px',
    position: 'relative',
    zIndex: ZINDEX_CONTENT,
    [mediaQueries.mUp]: {
      padding: '55px 0 120px 0'
    }
  }),
  intro: css({
    marginBottom: 30,
    [mediaQueries.mUp]: {
      marginBottom: 40
    }
  }),
  tab: css({
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: 20,
    position: 'relative',
    '& > button': {
      flexGrow: 1,
      width: '50%'
    }
  }),
  articleHeadline: css({
    margin: '30px 0 20px 0',
    [mediaQueries.mUp]: {
      margin: '40px 0 20px 0'
    }
  }),
  activeDiscussions: css({
    marginTop: 30,
    [mediaQueries.mUp]: {
      marginTop: 40
    }
  }),
  selectedHeadline: css({
    margin: '40px 0 26px 0',
    [mediaQueries.mUp]: {
      margin: '60px 0 30px 0'
    }
  })
}

class FeedbackPage extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      loading: false,
      isMobile: true,
      trackingId: undefined,
      searchValue: undefined
    }

    this.onChangeFromSearch = (selectedObj) => {
      const { router: { query } } = this.props
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

    this.handleResize = () => {
      const isMobile = window.innerWidth < mediaQueries.mBreakPoint
      if (isMobile !== this.state.isMobile) {
        this.setState({ isMobile })
      }
    }

    this.selectArticleTab = () => {
      const { router: { query } } = this.props
      const isSelected = query.t === 'article'
      Router.pushRoute(
        'discussion',
        isSelected ? undefined : { t: 'article' },
        { shallow: true }
      )
    }

    this.selectGeneralTab = () => {
      const { router: { query } } = this.props
      const isSelected = query.t === 'general'
      Router.pushRoute(
        'discussion',
        isSelected ? undefined : { t: 'general' },
        { shallow: true }
      )
    }

    this.setArticleRef = ref => {
      this.articleRef = ref
    }

    this.scrollToArticleDiscussion = () => {
      const { router: { query } } = this.props
      if (!query.focus && this.articleRef && query.t === 'article' && query.id) {
        const headerHeight = window.innerWidth < mediaQueries.mBreakPoint
          ? HEADER_HEIGHT_MOBILE
          : HEADER_HEIGHT
        setTimeout(() => {
          const { top } = this.articleRef.getBoundingClientRect()
          window.scrollTo({
            top: top - headerHeight - 20,
            left: 0,
            behavior: 'smooth'
          })
        }, 100)
      }
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.scrollToArticleDiscussion()
  }

  componentDidUpdate () {
    this.scrollToArticleDiscussion()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  render () {
    const { t, router: { asPath, query } } = this.props
    const {
      searchValue
    } = this.state

    const pageMeta = {
      title: t('pages/feedback/title'),
      image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
    }

    const tab = query.t

    const activeDiscussionId =
      tab === 'general'
        ? GENERAL_FEEDBACK_DISCUSSION_ID
        : tab === 'article' && query.id

    return (
      <Frame raw meta={pageMeta}>
        <Center {...styles.container}>
          <div {...styles.intro}>
            <Interaction.P>
              <WithMembership render={() => (
                <Fragment>{t('feedback/lead')}</Fragment>
              )} />
            </Interaction.P>
          </div>
          <WithMembership render={() => (
            <Fragment>
              <div {...styles.tab}>
                <Button
                  style={{ zIndex: 1 }}
                  dimmed={tab && tab !== 'article'}
                  onClick={this.selectArticleTab}>
                  {t('feedback/article/button')}
                </Button>
                <Button
                  style={{ marginLeft: '-1px', zIndex: tab === 'general' ? 1 : undefined }}
                  dimmed={tab && tab !== 'general'}
                  onClick={this.selectGeneralTab}>
                  {t('feedback/general/button')}
                </Button>
              </div>
              {!GENERAL_FEEDBACK_DISCUSSION_ID && (
                <div style={{ color: 'red', marginTop: 20 }}>
                  GENERAL_FEEDBACK_DISCUSSION_ID is undefined in .env
                </div>
              )}
            </Fragment>
          )} />
          {tab === 'article' && (
            <Fragment>
              <WithMembership render={() => (
                <Fragment>
                  <div {...styles.articleHeadline}>
                    <Interaction.H3>
                      {t('feedback/article/headline')}
                    </Interaction.H3>
                  </div>
                  <ArticleSearch
                    value={searchValue}
                    onChange={this.onChangeFromSearch}
                    onReset={this.onReset}
                  />
                  <div {...styles.activeDiscussions}>
                    <Label style={{ display: 'block', marginBottom: 10 }}>
                      {t('feedback/activeDiscussions/label')}
                    </Label>
                    <ActiveDiscussions
                      discussionId={activeDiscussionId}
                      onChange={this.onChangeFromActiveDiscussions}
                      onReset={this.onReset}
                      ignoreDiscussionId={GENERAL_FEEDBACK_DISCUSSION_ID}
                    />
                  </div>
                </Fragment>
              )} />
              <div {...styles.selectedHeadline} ref={this.setArticleRef}>
                <ArticleDiscussionHeadline discussionId={activeDiscussionId} />
              </div>
            </Fragment>
          )}
          {activeDiscussionId && (
            <Discussion
              discussionId={activeDiscussionId}
              focusId={query.focus}
              mute={query && !!query.mute}
              sharePath={asPath}
            />
          )}
          {!tab && (
            <WithMembership render={() => (
              <Fragment>
                <div {...styles.selectedHeadline}>
                  <Interaction.H3>
                    {t('feedback/latestComments/headline')}
                  </Interaction.H3>
                </div>
                <LatestComments />
              </Fragment>
            )} />
          )}
        </Center>
      </Frame>
    )
  }
}

export default compose(
  withT,
  withRouter
)(FeedbackPage)
