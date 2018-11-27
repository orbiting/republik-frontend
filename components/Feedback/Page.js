import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import { Router } from '../../lib/routes'

import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'
import { ZINDEX_CONTENT } from '../constants'

import Frame from '../Frame'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'

import Hitlist from './Hitlist'
import ArticleSearch from './ArticleSearch'
import LatestComments from './LatestComments'
import Discussion from '../Discussion/Discussion'
import Link from '../Link/Href'

import {
  Button,
  Center,
  TeaserFeed,
  Interaction,
  Label,
  linkRule,
  mediaQueries
} from '@project-r/styleguide'

const GENERAL_DISCUSSION_ID = '42ef501f-0be6-4120-b2cc-785182301595'

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

class Search extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      articleDiscussionId: undefined,
      loading: false,
      isMobile: true,
      trackingId: undefined,
      selectedView: undefined,
      meta: undefined,
      searchFilter: undefined,
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
      })
    }

    this.onChangeFromHitlist = selectedObj => {
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
        searchFilter: '',
        searchValue: null
      })
    }

    this.onFilterChange = (filter) => {
      this.setState({ searchFilter: filter })
    }

    this.onReset = () => {
      this.setState({
        searchValue: null,
        searchFilter: ''
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
      this.setState({ selectedView: 'article' })
    }

    this.selectGeneralTab = () => {
      this.setState({
        selectedView: 'general',
        discussionId: GENERAL_DISCUSSION_ID
      })
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    const { query } = this.props
    if (query && query.id) {
      const isGeneral = query.id === GENERAL_DISCUSSION_ID
      if (isGeneral) {
        this.setState({
          selectedView: 'general'
        })
      } else {
        this.setState({
          articleDiscussionId: query.id,
          selectedView: 'article'
        })
      }
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  render () {
    const { t } = this.props
    const {
      articleDiscussionId,
      selectedView,
      meta,
      searchValue,
      searchFilter
    } = this.state

    const pageMeta = {
      title: t('pages/search/title'),
      image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
    }

    const selectedDiscussionId =
      selectedView === 'general'
        ? GENERAL_DISCUSSION_ID
        : selectedView === 'article' && articleDiscussionId

    const linkedDiscussion = selectedView === 'article' && meta && meta.discussion

    const ArticleLink = meta && (
      <Link href={meta.path} passHref key='articlelink'>
        <a {...linkRule} href={meta.path}>
        «{meta.title}»
        </a>
      </Link>
    )

    return (
      <Frame raw meta={pageMeta}>
        <Center {...styles.container}>
          <div {...styles.intro}>
            <Interaction.P>
          Lassen Sie uns reden. Über bestimmte Artikel oder die Republik im Allgemeinen. Miteinander und konstruktiv im Geist unserer Netiquette. Worüber wollen Sie reden?
            </Interaction.P>
          </div>
          <div {...styles.tab}>
            <Button
              dimmed={selectedView && selectedView !== 'article'}
              onClick={this.selectArticleTab}>
            Artikel
            </Button>
            <Button
              dimmed={selectedView && selectedView !== 'general'}
              onClick={this.selectGeneralTab}>
            Allgemein
            </Button>
          </div>
          {selectedView === 'article' && (
            <Fragment>
              <div {...styles.hitlistHeadline}>
                <Interaction.H3>Welchen Artikel wollen Sie lesen oder darüber einen Beitrag erstellen?</Interaction.H3>
              </div>
              <Label style={{ display: 'block', marginBottom: 10 }}>Gerade aktive Diskussionen</Label>
              <Hitlist
                discussionId={articleDiscussionId}
                value={meta}
                onChange={this.onChangeFromHitlist}
                onReset={this.onReset}
                ignoreDiscussionId={GENERAL_DISCUSSION_ID}
              />
              <ArticleSearch
                value={searchValue}
                filter={searchFilter}
                onChange={this.onChangeFromSearch}
                onReset={this.onReset}
                onFilterChange={this.onFilterChange}
              />

              {meta && !linkedDiscussion && <div {...styles.selectedHeadline}>
                <Interaction.H3>
                  {t.elements('feedback/autoArticle/selected/headline', {
                    link: ArticleLink
                  })}
                </Interaction.H3>
              </div>}
              {meta && linkedDiscussion && <Fragment>
                <div {...styles.selectedHeadline}>
                  <Interaction.H3 {...styles.selectedHeadline}>
                    {t.elements('feedback/linkedArticle/selected/headline', {
                      link: ArticleLink
                    })}
                  </Interaction.H3>
                </div>
                <TeaserFeed {...linkedDiscussion} />

              </Fragment>}

            </Fragment>
          )}
          {selectedDiscussionId && (
            <Discussion discussionId={selectedDiscussionId} />
          )}
          {!selectedDiscussionId && (
            <Fragment>
              <div {...styles.selectedHeadline}>
                <Interaction.H3>
              Neueste Beiträge
                </Interaction.H3>
              </div>
              <LatestComments />
            </Fragment>
          )}
        </Center>
      </Frame>
    )
  }
}

export default compose(
  // enforceMembership,
  withMe,
  withT
)(Search)
