import React, { Component, Fragment } from 'react'
import { Query, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'next/router'
import { css } from 'glamor'

import {
  mediaQueries,
  fontStyles,
  Center,
  Interaction,
  linkRule,
  Button,
  Loader
} from '@project-r/styleguide'

import PathLink from '../Link/Path'
import Greeting, { fragments as fragmentsGreeting } from './Greeting'
import Newsletter, {
  fragments as fragmentsNewsletter
} from './Sections/Newsletter'
import AppLogin, { fragments as fragmentsAppLogin } from './Sections/AppLogin'
import Usability, {
  fragments as fragmentsUsability
} from './Sections/Usability'
import Profile, { fragments as fragmentsProfile } from './Sections/Profile'
import Frame from '../Frame'
import { scrollIt } from '../../lib/utils/scroll'
import { HEADER_HEIGHT } from '../constants'
import { Link } from '../../lib/routes'
import { SECTION_SPACE } from './Section'
import withT from '../../lib/withT'

const { P } = Interaction

const QUERY = gql`
  query getOnboarding {
    me {
      ...NewsletterUser
      ...AppLoginUser
      ...UsabilityUser
      ...ProfileUser
    }

    employees(shuffle: 1, withGreeting: true) {
      ...GreetingEmployee
    }
  }

  ${fragmentsNewsletter.user}
  ${fragmentsAppLogin.user}
  ${fragmentsUsability.user}
  ${fragmentsProfile.user}

  ${fragmentsGreeting.employee}
`

const styles = {
  title: css({
    ...fontStyles.sansSerifMedium58,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 80,
    [mediaQueries.onlyS]: {
      ...fontStyles.sansSerifMedium40,
      marginBottom: 50
    }
  }),
  p: css({
    marginBottom: 20
  }),
  sections: css({
    paddingTop: SECTION_SPACE,
    paddingBottom: SECTION_SPACE
  }),
  buttonContainer: css({
    marginBottom: SECTION_SPACE
  })
}

class Page extends Component {
  constructor(props) {
    super(props)

    const {
      router: {
        query,
        query: { context }
      }
    } = props

    this.sections = [
      {
        component: Newsletter,
        name: 'newsletter',
        ref: React.createRef(),
        visited: false
      },
      {
        component: AppLogin,
        name: 'app-login',
        ref: React.createRef(),
        visited: false
      },
      {
        component: Usability,
        name: 'usability',
        ref: React.createRef(),
        visited: false
      },
      context !== 'card' && {
        component: Profile,
        name: 'profile',
        ref: React.createRef(),
        visited: false
      }
    ].filter(Boolean)

    this.state = {
      expandedSection: this.sections.find(s => s.name === query.section)
        ? query.section
        : null,
      hasOnceVisitedAll: false
    }

    this.onExpand = props => {
      this.setState(({ expandedSection }) => ({
        expandedSection: expandedSection === props.name ? null : props.name
      }))
    }

    this.onContinue = () => {
      const { expandedSection } = this.state
      let sectionIndex = 0

      if (expandedSection) {
        const currentSection = this.sections.find(
          ({ name }) => expandedSection === name
        )
        currentSection.visited = true

        const nextIndex =
          this.sections.findIndex(({ name }) => expandedSection === name) + 1

        if (nextIndex < this.sections.length) {
          sectionIndex = nextIndex
        } else {
          this.setState({
            expandedSection: null,
            hasOnceVisitedAll: this.sections.every(section => !!section.visited)
          })

          return
        }
      }

      this.setState(
        { expandedSection: this.sections[sectionIndex].name },
        () => {
          const { top } = this.sections[
            sectionIndex
          ].ref.current.getBoundingClientRect()
          const { pageYOffset } = window

          const target = pageYOffset + top - HEADER_HEIGHT * 1.2
          scrollIt(target, 400)
        }
      )
    }
  }

  render() {
    const {
      router: {
        query: { context }
      },
      t
    } = this.props
    const { expandedSection } = this.state

    const meta = {
      title: t.first([
        `Onboarding/Page/${context}/meta/title`,
        'Onboarding/Page/meta/title'
      ])
    }

    return (
      <Frame meta={meta} raw>
        <Query query={QUERY}>
          {({ loading, error, data }) => {
            if (loading || error) {
              return <Loader loading={loading} error={error} />
            }

            const { me: user, employees } = data

            return (
              <Center>
                <div {...styles.title}>
                  {t.first([
                    `Onboarding/Page/${context}/title`,
                    'Onboarding/Page/title'
                  ])}
                </div>
                <P {...styles.p}>
                  {t.first([
                    `Onboarding/Page/${context}/preface`,
                    'Onboarding/Page/preface'
                  ])}
                </P>
                {context && <Greeting employee={employees[0]} />}
                <P {...styles.p}>
                  {t.first(
                    [
                      `Onboarding/Page/${context}/introduction`,
                      'Onboarding/Page/introduction'
                    ],
                    null,
                    ''
                  )}
                </P>

                <div {...styles.sections}>
                  {this.sections.map(
                    ({ component: Component, name, ref, visited }) => {
                      return (
                        <Component
                          key={name}
                          name={name}
                          user={user}
                          onExpand={this.onExpand.bind(this)}
                          isExpanded={expandedSection === name}
                          onContinue={this.onContinue.bind(this)}
                          forwardedRef={ref}
                          isVisited={visited}
                        />
                      )
                    }
                  )}
                </div>

                {!!context && (
                  <Fragment>
                    {/* this.state.hasOnceVisitedAll && (
                      <div style={{ background: colors.primary, height: 140, marginBottom: 20 }}>
                        <P>Grafisches Element, dass alle Section durchgearbeitet wurden und es jetzt losgehen kann.</P>
                      </div>
                    ) */}
                    <div {...styles.buttonContainer}>
                      <Link route='index'>
                        <Button primary={!expandedSection}>
                          {t.first([
                            `Onboarding/Page/${context}/button`,
                            'Onboarding/Page/button'
                          ])}
                        </Button>
                      </Link>
                    </div>
                  </Fragment>
                )}

                <P {...styles.p}>
                  {t.first.elements(
                    [
                      `Onboarding/Page/${context}/more/account`,
                      'Onboarding/Page/more/account'
                    ],
                    {
                      link: (
                        <Link key='account' route='account' passHref>
                          <a {...linkRule}>
                            {t.first([
                              `Onboarding/Page/${context}/more/account/link`,
                              'Onboarding/Page/more/account/link'
                            ])}
                          </a>
                        </Link>
                      )
                    }
                  )}
                </P>

                <P {...styles.p}>
                  {t.first.elements(
                    [
                      `Onboarding/Page/${context}/more/questions`,
                      'Onboarding/Page/more/questions'
                    ],
                    {
                      linkManual: (
                        <PathLink key='anleitung' path='/anleitung' passHref>
                          <a {...linkRule}>
                            {t.first([
                              `Onboarding/Page/${context}/more/questions/linkManual`,
                              'Onboarding/Page/more/questions/linkManual'
                            ])}
                          </a>
                        </PathLink>
                      ),
                      linkFaq: (
                        <Link key='route' route='faq' passHref>
                          <a {...linkRule}>
                            {t.first([
                              `Onboarding/Page/${context}/more/questions/linkFaq`,
                              'Onboarding/Page/more/questions/linkFaq'
                            ])}
                          </a>
                        </Link>
                      )
                    }
                  )}
                </P>
                <P {...styles.p}>
                  {t.first.elements(
                    [
                      `Onboarding/Page/${context}/more/help`,
                      'Onboarding/Page/more/help'
                    ],
                    {
                      email: (
                        <a
                          key='email'
                          href={`mailto:${t(
                            'Onboarding/Page/more/help/email'
                          )}`}
                          {...linkRule}
                        >
                          {t('Onboarding/Page/more/help/email')}
                        </a>
                      )
                    }
                  )}
                </P>
              </Center>
            )
          }}
        </Query>
      </Frame>
    )
  }
}

export default compose(
  withT,
  withRouter
)(Page)
