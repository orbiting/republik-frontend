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
import Input from './Input'
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
      loading: false,
      isMobile: true,
      trackingId: undefined,
      selectedView: undefined,
      article: undefined,
      inputFilter: undefined,
      inputValue: undefined
    }

    this.onInputChange = (value) => {
      if (!value || value === this.state.article) {
        return
      }
      this.setState({
        article: value,
        inputValue: { text: value.title, value: value }
      })
    }

    this.onHitlistChange = (value) => {
      if (value === this.state.article) {
        return
      }
      this.setState({
        article: value,
        inputFilter: '',
        inputValue: null
      })
    }

    this.onReset = () => {
      this.clearUrl()
      console.log('reset')
      this.setState({
        inputValue: null,
        inputFilter: ''
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
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  render () {
    const { t } = this.props
    const {
      selectedView,
      article,
      inputValue,
      inputFilter
    } = this.state

    const meta = {
      title: t('pages/search/title'),
      image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
    }

    /* const items = [
        {text: 'Januar', value: '01'},
        {text: 'Februar', value: '02'},
        {text: 'März', value: '03'},
        {text: 'April', value: '04'},
        {text: 'Mai', value: '05'},
        {text: 'Juni', value: '06'},
        {text: 'Juli', value: '07'},
        {text: 'August', value: '08'},
        {text: 'September', value: '09'},
        {text: 'Oktober', value: '10'},
        {text: 'November', value: '10'},
        {text: 'Dezember', value: '10'}
      ] */
    const articleDiscussions = [
      {
        id: 'id1',
        title: 'Autodiskussion zum Dieselskandal',
        discussion: {
          id: '38f238fa-938a-466e-9d4e-1c72000654c5',
          type: 'auto'
        },
        path: '/2018/03/01/someslug'
      },
      {
        id: 'id2',
        title: 'Eine verlinkte Debatte',
        path: '/2018/03/01/someotherslug',
        discussion: {
          id: '38f238fa-938a-466e-9d4e-1c72000654c5',
          path: '/2018/10/25/daniels-achte-debatte/diskussion',
          title: 'Eine verlinkte Debatte',
          description: 'Hier steht eine Deskription',
          kind: 'editorial'
        }
      },
      {
        id: 'id3',
        title: 'Artikel nummer drei'
      },
      {
        id: 'id4',
        title: 'Der vierte Artikel'
      },
      {
        id: 'id5',
        title: 'Foifer undes Weggli'
      },
      {
        id: 'id6',
        title: 'Sex sells'
      },
      {
        id: 'id7',
        title: 'Siebenhundert Zeichen'
      },
      {
        id: 'id8',
        title: 'Achtung 8'
      },
      {
        id: 'id9',
        title: 'Neunmalklug'
      },
      {
        id: 'id10',
        title: 'Dezidiert dekadent'
      }
    ]

    const items = articleDiscussions.map(d => ({
      text: d.title,
      value: d
    }))

    const selectedDiscussionId = selectedView === 'general'
      ? GENERAL_DISCUSSION_ID
      : selectedView === 'article' && article && article.discussion && article.discussion.type === 'auto' && article.discussion.id

    const linkedDiscussion = selectedView === 'article' && article && article.discussion && article.discussion.type !== 'auto' && article.discussion

    const ArticleLink = article && (
      <Link href={article.path} passHref key='articlelink'>
        <a {...linkRule} href={article.path}>
        «{article.title}»
        </a>
      </Link>
    )

    return (
      <Frame raw meta={meta}>
        <Center {...styles.container}>
          <div {...styles.intro}>
            <Interaction.P>
          Lassen Sie uns reden. Über bestimmte Artikel oder die Republik im Allgemeinen. Miteinander und konstruktiv im Geist unserer Netiquette. Worüber wollen Sie reden?
            </Interaction.P>
          </div>
          <div {...styles.tab}>
            <Button
              dimmed={selectedView && selectedView !== 'article'}
              onClick={() => { this.setState({ selectedView: 'article' }) }}>
            Artikel
            </Button>
            <Button
              dimmed={selectedView && selectedView !== 'general'}
              onClick={() => { this.setState({ selectedView: 'general' }) }}>
            Allgemein
            </Button>
          </div>
          {selectedView === 'article' && (
            <Fragment>
              <div {...styles.hitlistHeadline}>
                <Interaction.H3>Welchen Artikel wollen Sie lesen oder darüber einen Beitrag erstellen?</Interaction.H3>
              </div>
              <Label style={{ display: 'block', marginBottom: 10 }}>Gerade aktive Diskussion zu Artikeln</Label>
              <Hitlist
                items={items}
                value={article}
                onChange={this.onHitlistChange}
                onReset={this.onReset}
              />
              <Input
                items={items}
                value={inputValue}
                filter={inputFilter}
                onChange={this.onInputChange}
                onReset={this.onReset}
                onFilterChange={this.onFilterChange}
              />

              {article && !linkedDiscussion && <div {...styles.selectedHeadline}>
                <Interaction.H3>
                  {t.elements('feedback/autoArticle/selected/headline', {
                    link: ArticleLink
                  })}
                </Interaction.H3>
              </div>}
              {article && linkedDiscussion && <Fragment>
                <div {...styles.selectedHeadline}>
                  <Interaction.H3>
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
        </Center>
      </Frame>
    )
  }
}

// export default Search
export default compose(
  // enforceMembership,
  withMe,
  withT
)(Search)
