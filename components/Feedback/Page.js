import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import { Router } from '../../lib/routes'
import withT from '../../lib/withT'

import {
  CDN_FRONTEND_BASE_URL,
  GENERAL_FEEDBACK_DISCUSSION_ID
} from '../../lib/constants'
import { ZINDEX_CONTENT } from '../constants'

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
  hitlistHeadline: css({
    margin: '30px 0 25px 0',
    [mediaQueries.mUp]: {
      margin: '43px 0 37px 0'
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
      articleDiscussionId: undefined,
      loading: false,
      isMobile: true,
      trackingId: undefined,
      tab: undefined,
      meta: undefined,
      searchValue: undefined
    }

    this.onChangeFromSearch = (selectedObj) => {
      if (!selectedObj) {
        return
      }
      const { discussionId, meta, routePath, title } = selectedObj
      if (routePath) {
        Router.pushRoute(routePath)
        return
      }
      if (!discussionId || discussionId === this.state.articleDiscussionId) {
        return
      }
      this.setState({
        articleDiscussionId: discussionId,
        meta,
        searchValue: { text: title, value: selectedObj }
      }, this.updateUrl)
    }

    this.onChangeFromActiveDiscussions = selectedObj => {
      const articleDiscussionId = selectedObj && selectedObj.discussionId
      if (
        articleDiscussionId &&
        articleDiscussionId === this.state.articleDiscussionId
      ) {
        return
      }
      this.setState({
        articleDiscussionId,
        meta: selectedObj && selectedObj.meta,
        searchValue: null
      }, this.updateUrl)
    }

    this.onTeaserClick = selectedObj => {
      const discussionId = selectedObj && selectedObj.discussionId
      if (
        !discussionId
      ) {
        return
      }
      const isGeneral = discussionId === GENERAL_FEEDBACK_DISCUSSION_ID
      const articleDiscussionId = isGeneral ? undefined : discussionId
      this.setState({
        articleDiscussionId,
        meta: selectedObj && selectedObj.meta,
        searchValue: null,
        tab: isGeneral ? 'general' : 'article',
        focusId: selectedObj && selectedObj.focusId
      }, this.updateUrl)
    }

    this.onReset = () => {
      this.setState({
        searchValue: null
      })
    }

    this.pushUrl = (params) => {
      Router.replaceRoute(
        'feedback',
        params,
        { shallow: true }
      )
    }

    this.handleResize = () => {
      const isMobile = window.innerWidth < mediaQueries.mBreakPoint
      if (isMobile !== this.state.isMobile) {
        this.setState({ isMobile })
      }
    }

    this.selectArticleTab = () => {
      const isSelected = this.state.tab === 'article'
      this.setState({ tab: isSelected ? '' : 'article', focusId: null }, this.updateUrl)
    }

    this.selectGeneralTab = () => {
      const isSelected = this.state.tab === 'general'
      this.setState({
        tab: isSelected ? '' : 'general',
        discussionId: isSelected ? null : GENERAL_FEEDBACK_DISCUSSION_ID,
        focusId: null
      }, this.updateUrl)
    }

    this.setStateFromQuery = (query) => {
      if (!query) {
        return
      }
      const { id, t, focus } = query
      const isGeneral = id === GENERAL_FEEDBACK_DISCUSSION_ID || t === 'general'
      if (isGeneral) {
        this.setState({
          tab: 'general',
          focusId: focus
        })
      } else if (id || t === 'article') {
        this.setState({
          articleDiscussionId: id,
          tab: 'article',
          focusId: focus
        })
      }
    }

    this.pushUrl = (params) => {
      Router.replaceRoute(
        'feedback',
        params,
        { shallow: true }
      )
    }

    this.updateUrl = () => {
      const { articleDiscussionId, tab, focusId } = this.state
      const id =
        tab === 'article' && articleDiscussionId
          ? encodeURIComponent(articleDiscussionId)
          : undefined
      const focus = focusId ? encodeURIComponent(focusId) : undefined
      const t = tab || undefined
      this.pushUrl({ id, t, focus })
    }

    this.clearUrl = () => {
      this.pushUrl({})
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.setStateFromQuery(this.props.query)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  render () {
    const { t } = this.props
    const {
      articleDiscussionId,
      tab,
      meta,
      searchValue,
      focusId
    } = this.state

    const pageMeta = {
      title: t('pages/feedback/title'),
      image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
    }

    const selectedDiscussionId =
      tab === 'general'
        ? GENERAL_FEEDBACK_DISCUSSION_ID
        : tab === 'article' && articleDiscussionId

    const linkedDiscussion = tab === 'article' && meta && meta.discussion

    return (
      <Frame raw meta={pageMeta}>
        <Center {...styles.container}>
          <div {...styles.intro}>
            <Interaction.P>
              {t('feedback/lead')}
            </Interaction.P>
          </div>
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
          {tab === 'article' && (
            <Fragment>
              <div {...styles.hitlistHeadline}>
                <Interaction.H3>
                  {t('feedback/article/headline')}
                </Interaction.H3>
              </div>
              <Label style={{ display: 'block', marginBottom: 10 }}>
                {t('feedback/activeDiscussions/label')}
              </Label>
              <ActiveDiscussions
                discussionId={articleDiscussionId}
                value={meta}
                onChange={this.onChangeFromActiveDiscussions}
                onReset={this.onReset}
                ignoreDiscussionId={GENERAL_FEEDBACK_DISCUSSION_ID}
              />
              <ArticleSearch
                value={searchValue}
                onChange={this.onChangeFromSearch}
                onReset={this.onReset}
              />

              {!linkedDiscussion && <div {...styles.selectedHeadline}>
                <ArticleDiscussionHeadline meta={meta} discussionId={articleDiscussionId} />
              </div>}
            </Fragment>
          )}
          {selectedDiscussionId && (
            <Discussion discussionId={selectedDiscussionId} focusId={focusId} />
          )}
          {!selectedDiscussionId && (
            <Fragment>
              <div {...styles.selectedHeadline}>
                <Interaction.H3>
                  {t('feedback/latestComments/headline')}
                </Interaction.H3>
              </div>
              <LatestComments
                onTeaserClick={this.onTeaserClick}
                filter={tab === 'article' ? [GENERAL_FEEDBACK_DISCUSSION_ID] : undefined}
              />
            </Fragment>
          )}
        </Center>
      </Frame>
    )
  }
}

export default withT(FeedbackPage)
