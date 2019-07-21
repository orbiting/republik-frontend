import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import throttle from 'lodash/throttle'
import {
  Container,
  RawHtml,
  Interaction,
  Editorial,
  Loader,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

import { countFormat } from '../../lib/utils/format'
import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

import {
  List as TestimonialList,
  testimonialFields
} from '../Testimonial/List'

import TeaserBlock from '../Overview/TeaserBlock'
import { getTeasersFromDocument } from '../Overview/utils'
import Accordion from '../Pledge/Accordion'
import Cards from './Cards'
import SignIn from '../Auth/SignIn'
import UserGuidance from '../Account/UserGuidance'

import { buttonStyles, sharedStyles } from './styles'

import { negativeColors } from '../Frame/constants'
import ErrorMessage from '../ErrorMessage'

const query = gql`
query marketingMembershipStats {
  me {
    id
    memberships {
      id
    }
    accessGrants {
      id
    }
  }
  membershipStats {
    count
  }
  front: document(path: "/") {
    children(first: 65) {
      nodes {
        body
      }
    }
  }
  statements(first: 6) {
    totalCount
    nodes {
      ${testimonialFields}
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`

const MEDIUM_MAX_WIDTH = 974
const SMALL_MAX_WIDTH = 680

const styles = {
  overviewContainer: css({
    backgroundColor: negativeColors.containerBg,
    color: negativeColors.text,
    padding: '30px 20px',
    paddingBottom: 0
  }),
  overviewBottomShadow: css({
    position: 'absolute',
    bottom: 0,
    height: 100,
    left: 0,
    right: 0,
    background: 'linear-gradient(0deg, rgba(17,17,17,0.9) 0%, rgba(17,17,17,0.8) 30%, rgba(17,17,17,0) 100%)',
    pointerEvents: 'none'
  }),
  lead: css({
    maxWidth: 700,
    margin: '0 auto 30px',
    ...fontStyles.serifRegular,
    fontSize: 26,
    lineHeight: '32px',
    color: negativeColors.text,
    textAlign: 'center',
    [mediaQueries.mUp]: {
      fontSize: 30,
      lineHeight: '40px',
      marginBottom: 30,
      marginTop: 10
    }
  }),
  h2: css({
    marginBottom: 10,
    textAlign: 'center',
    [mediaQueries.mUp]: {
      marginBottom: 30
    }
  }),
  split: css({
    [mediaQueries.mUp]: {
      display: 'flex'
    }
  }),
  preview: css({
    marginBottom: '50px',
    [mediaQueries.mUp]: {
      marginRight: '50px',
      flex: 1
    }
  }),
  offers: css({
    [mediaQueries.mUp]: {
      flex: 1
    }
  }),
  cards: css({
    background: negativeColors.primaryBg,
    margin: '30px 0',
    height: '960px',
    [mediaQueries.mUp]: {
      margin: '50px 0',
      height: '760px'
    }
  })
}

class MarketingPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cardsReached: false
    }
    this.onHighlight = highlight => this.setState({ highlight })
    this.cardsRef = React.createRef()

    this.measure = () => {
      if (this.cardsRef) {
        const rect = this.cardsRef.current.getBoundingClientRect()
        this.cardsY = window.pageYOffset + rect.top
      }
    }

    this.onScroll = throttle(() => {
      const y = window.pageYOffset

      const cardsReached =
        this.cardsY && y + window.innerHeight > this.cardsY

      if (cardsReached && !this.state.cardsReached) {
        this.setState({ cardsReached: true })
        window.removeEventListener('scroll', this.onScroll)
      }
    }, 200)
  }

  componentDidMount () {
    this.measure()
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
  }

  componentDidUpdate () {
    this.measure()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }

  render () {
    const { t, data: { loading, error, me, membershipStats, front, statements } } = this.props

    const { cardsReached } = this.state

    const hasMembershipOrAccessGrant = me && (
      (me.memberships && me.memberships.length > 0) ||
      (me.accessGrants && me.accessGrants.length > 0)
    )

    return (
      <Fragment>
        {!loading && me && !hasMembershipOrAccessGrant && <UserGuidance />}
        <div style={{ overflow: 'hidden' }}>
          {!error && <div {...styles.overviewContainer}>
            <Container style={{
              maxWidth: 1200,
              padding: 0,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <h1 {...styles.lead}>
                <RawHtml dangerouslySetInnerHTML={{
                  __html: t('marketing/v2/overview/title')
                }} />
              </h1>
              <Loader loading={loading} style={{ minHeight: 600 }} render={() => (
                <TeaserBlock
                  teasers={getTeasersFromDocument(front)}
                  highlight={this.state.highlight}
                  onHighlight={this.onHighlight}
                  maxHeight={520}
                  overflow
                  lazy />
              )} />
              <div {...styles.overviewBottomShadow} />
            </Container>
          </div>}
          <Container>
            <div {...sharedStyles.actions}>
              <div>
                <Link route='pledge' params={{ package: 'ABO' }}>
                  <button {...buttonStyles.primary}>
                    {t('marketing/v2/join/button/label')}
                  </button>
                </Link>
              </div>
              <Link route='preview'>
                <button {...buttonStyles.standard}>
                  {t('marketing/v2/preview/button/label')}
                </button>
              </Link>
            </div>
            <div {...sharedStyles.signIn}>
              {t.elements(
                'marketing/signin',
                { link: <Link key='link' route={'signin'}>
                  <a>{t('marketing/v2/signin/link') }</a>
                </Link>
                }
              )}{' – '}
              {t.elements('marketing/claim', {
                claimLink: (
                  <Link route='claim' key='claim' passHref>
                    <Editorial.A>
                      {t('marketing/v2/claim/link')}
                    </Editorial.A>
                  </Link>
                )
              })}
            </div>
            {error && <ErrorMessage error={error} style={{ textAlign: 'center' }} />}
          </Container>
        </div>

        {!error && <Fragment>
          <Container style={{ maxWidth: SMALL_MAX_WIDTH }}>
            <Interaction.H2 {...styles.h2}>
              Ein Projekt gegen den Zynismus
            </Interaction.H2>
            <Editorial.P>
              Unser Journalismus verteidigt die Institutionen der Demokratie gegen den Vormarsch der Autoritären. Wir lassen uns nicht von Angst leiten, sondern von den Werten der Aufklärung.
            </Editorial.P>
            <Editorial.P>
              Die Schweiz ist erfolgreich, wenn Liberale und Linke, Progressive und Konservative gemeinsam um Lösungen ringen. Deshalb ist die Republik politisch nicht festgelegt, aber keineswegs neutral.
            </Editorial.P>
            <Editorial.P>
              Wir stehen für die Treue zu Fakten, für Offenheit gegenüber Kritik, für Respektlosigkeit gegenüber der Macht und Respekt vor dem Menschen.
            </Editorial.P>
          </Container>

          <Container style={{ maxWidth: MEDIUM_MAX_WIDTH }}>
            <div {...sharedStyles.spacer} />
            <div {...styles.split}>
              <div {...styles.preview}>
                <Interaction.H3 style={{ marginBottom: '17px' }}>
                  {t('marketing/v2/preview/title')}
                </Interaction.H3>
                <Interaction.P>
                  {t('marketing/signup/lead')}
                </Interaction.P>
                <div {...styles.signUp}>
                  <SignIn label={t('marketing/signup/button/label')} context='preview' />
                </div>
              </div>
              <div {...styles.offers}>
                <Interaction.H3 style={{ marginBottom: '17px' }}>
                  {t('marketing/v2/offers/title')}
                </Interaction.H3>
                <Accordion crowdfundingName={'LAUNCH'} singleGroup={'ME'} />
              </div>
            </div>
          </Container>

          <Container style={{ maxWidth: SMALL_MAX_WIDTH }}>
            <div {...sharedStyles.spacer} />
            <Interaction.H2 {...styles.h2}>
              Unser Magazin ist unabhängig und werbefrei
            </Interaction.H2>
            <Editorial.P>
              Unser einziges Produkt ist vernünftiger Journalismus. Und unser einziger Kunde sind Sie. Wir bieten Ihnen Einordnung und Vertiefung anstelle einer Flut von Nachrichten. Wir wollen Sie inspirieren, bereichern und überraschen – mit Beiträgen zu den drängenden Fragen der Gegenwart.
            </Editorial.P>
          </Container>

          <div {...styles.cards} ref={this.cardsRef}>
            {cardsReached && <Cards />}
          </div>

          <Container style={{ maxWidth: SMALL_MAX_WIDTH }}>
            <Editorial.P>
              Wir sind kompromisslos in der Qualität bei Sprache und Bild. Wir respektieren Ihre digitale Privatsphäre und schützen Ihre persönlichen Daten.
            </Editorial.P>
            <Editorial.P>
              Unsere Community respektiert abweichende Meinungen und debattiert konstruktiv. Bei uns reden Expertinnen, Leser und Journalistinnen miteinander. Es zählt das beste Argument.
            </Editorial.P>
            <Editorial.P>
              Wir pflegen eine offene Fehlerkultur und begegnen Ihnen auf Augenhöhe. Und wir hören auf Sie, wenn es um die Weiterentwicklung der Republik geht.
            </Editorial.P>
          </Container>

          <Container>
            <div {...sharedStyles.actions}>
              <div>
                <Link route='pledge' params={{ package: 'ABO' }}>
                  <button {...buttonStyles.primary}>
                    {t('marketing/v2/join/button/label')}
                  </button>
                </Link>
              </div>
              <Link route='pledge' params={{ package: 'MONTHLY_ABO' }}>
                <button {...buttonStyles.standard}>
                  {t('marketing/v2/monthly/button/label')}
                </button>
              </Link>
            </div>
          </Container>

          <Container style={{ maxWidth: SMALL_MAX_WIDTH }}>
            <div {...sharedStyles.spacer} />
            <Interaction.H2 {...styles.h2}>
              Ohne Journalismus keine Demokratie
            </Interaction.H2>
            <Editorial.P>
              Den traditionellen Verlagen geht es je länger, desto schlechter. Ihre werbegetriebenen Geschäftsmodelle funktionieren nicht mehr. Das Resultat dieser Entwicklung ist Abbau und Konzentration. Vielfalt und Unabhängigkeit gehen verloren. Die vierte Gewalt ist heute existenziell bedroht.
            </Editorial.P>
            <Editorial.P>
              Nur gemeinsam können wir etwas dagegen tun. Dafür braucht es nicht nur Journalisten, sondern auch Sie. Als Leserin. Als Bürger. Als Menschen, der bereit ist, etwas Geld in unabhängigen, werbefreien Journalismus zu investieren. Bauen wir zusammen ein neues Geschäftsmodell!
            </Editorial.P>
            <Editorial.P>
              Sobald Sie eine Mitgliedschaft kaufen, werden Sie ein klein wenig Besitzerin des Unternehmens. Sie sind Mitglied der Project R Genossenschaft, die das grösste Aktienpaket an der Republik hält. Sie wollen nicht Teil einer Genossenschaft sein, sondern ausschliesslich Zugriff auf das Magazin haben? Dann schlagen wir Ihnen den Kauf eines Monatsabos vor.
            </Editorial.P>
          </Container>

          <Container style={{ maxWidth: MEDIUM_MAX_WIDTH }}>
            <div {...sharedStyles.spacer} />
            <Interaction.H2 {...styles.h2}>
              {t(
                'marketing/v2/community/title',
                {
                  count: membershipStats
                    ? countFormat(membershipStats.count)
                    : t('marketing/v2/community/defaultCount')
                }
              )}
            </Interaction.H2>
            <TestimonialList
              singleRow
              minColumns={3}
              first={6}
              statements={statements && statements.nodes}
              loading={loading}
              t={t} />
            <Interaction.P style={{ marginTop: 10, textAlign: 'center' }}>
              <Link route='community' passHref>
                <Editorial.A>
                  {t('marketing/v2/community/moreStatements', {
                    count: statements ? countFormat(statements.totalCount) : ''
                  })}
                </Editorial.A>
              </Link>
            </Interaction.P>
            <div {...sharedStyles.spacer} />
            <div {...sharedStyles.actions} style={{ marginTop: 0 }}>
              <div>
                <Link route='pledge' params={{ package: 'ABO' }}>
                  <button {...buttonStyles.primary}>
                    {t('marketing/v2/bottom/join/button/label')}
                  </button>
                </Link>
              </div>
              <Link route='preview'>
                <button {...buttonStyles.standard}>
                  {t('marketing/v2/bottom/preview/button/label')}
                </button>
              </Link>
            </div>
            <div {...sharedStyles.spacer} />
          </Container>
        </Fragment>}
      </Fragment>
    )
  }
}

export default compose(
  withT,
  graphql(query)
)(MarketingPage)
