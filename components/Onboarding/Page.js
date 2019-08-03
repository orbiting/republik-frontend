import React, { Component, Fragment } from 'react'
import { Query } from 'react-apollo'
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
  colors,
  Loader
} from '@project-r/styleguide'

import Greeting, { fragments as fragmentsGreeting } from './Greeting'
import Newsletter, { fragments as fragmentsNewsletter } from './Sections/Newsletter'
import AppLogin, { fragments as fragmentsAppLogin } from './Sections/AppLogin'
import Usability, { fragments as fragmentsUsability } from './Sections/Usability'
import Profile, { fragments as fragmentsProfile } from './Sections/Profile'
import Frame from '../Frame'
import { scrollIt } from '../../lib/utils/scroll'
import { HEADER_HEIGHT } from '../constants'
import { Link } from '../../lib/routes'
import { SECTION_SPACE } from './Section'

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
  constructor (props) {
    super(props)

    this.state = {
      expandedSection: null,
      hasOnceVisitedAll: false
    }

    this.sections = [
      { component: Newsletter, name: 'newsletter', ref: React.createRef(), visited: false },
      { component: AppLogin, name: 'app-login', ref: React.createRef(), visited: false },
      { component: Usability, name: 'usability', ref: React.createRef(), visited: false },
      { component: Profile, name: 'profile', ref: React.createRef(), visited: false }
    ]

    this.onExpand = props => {
      this.setState(({ expandedSection }) => ({
        expandedSection: expandedSection === props.name ? null : props.name
      }))
    }

    this.onContinue = () => {
      const { expandedSection } = this.state
      let sectionIndex = 0

      if (expandedSection) {
        const currentSection = this.sections.find(({ name }) => expandedSection === name)
        currentSection.visited = true

        const nextIndex = this.sections.findIndex(({ name }) => expandedSection === name) + 1

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
          const { top } = this.sections[sectionIndex].ref.current.getBoundingClientRect()
          const { pageYOffset } = window

          const target = pageYOffset + top - (HEADER_HEIGHT * 1.2)
          scrollIt(target, 400)
        }
      )
    }
  }

  render () {
    const meta = {
      title: 'Konto einrichten'
    }

    const { router: { query: { context } } } = this.props
    const { expandedSection } = this.state

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
                {!context && (
                  <Fragment>
                    <div {...styles.title}>Konto einrichten 🔧</div>
                    <P {...styles.p}>
                      Das Wichtigste zum Republik-Nutzen finden Sie hier.
                    </P>
                  </Fragment>
                )}

                {['pledge', 'claim'].includes(context) && (
                  <Fragment>
                    <div {...styles.title}>Danke 🌟</div>
                    <P {...styles.p}>
                      Mit Ihrer Mitgliedschaft können Sie absofort nicht nur die Republik konsumieren,
                      sondern können und sollen sie auch beeinflussen.
                    </P>
                    <Greeting employee={employees[0]} />
                    <P {...styles.p}>
                      Mit dem Wichtigsten vorab hilft Ihnen dieser kurze Einrichtungs-Assistent.
                    </P>
                  </Fragment>
                )}

                {context === 'access' && (
                  <Fragment>
                    <div {...styles.title}>Ihre «Tour de la Republik» 🚴‍</div>
                    <P {...styles.p}>
                      Sie können sich in den kommenden Tagen ohne Einschränkung bei uns umsehen. Und
                      versuchen - natürlich - Sie von uns zu überzeugen.
                    </P>
                    <Greeting />
                    <P {...styles.p}>
                      Damit Ihre wenigen Probetage zu vielen Bleibentage werden, hilft Ihnen dieser
                      Einrichtungs-Assistent mit dem Wichtigsten.
                    </P>
                  </Fragment>
                )}

                <div {...styles.sections}>
                  {this.sections.map(({ component: Component, name, ref, visited }) => {
                    return (
                      <Component
                        key={name}
                        name={name}
                        user={user}
                        onExpand={this.onExpand.bind(this)}
                        isExpanded={expandedSection === name}
                        onContinue={this.onContinue.bind(this)}
                        forwardedRef={ref}
                        isVisited={visited} />
                    )
                  })}
                </div>

                {!!context && (
                  <Fragment>
                    {this.state.hasOnceVisitedAll && (
                      <div style={{ background: colors.primary, height: 140, marginBottom: 20 }}>
                        <P>Grafisches Element, dass alle Section durchgearbeitet wurden und es jetzt losgehen kann.</P>
                      </div>
                    )}
                    <div {...styles.buttonContainer}>
                      <Link route='index'>
                        <Button primary={!expandedSection}>Magazin lesen</Button>
                      </Link>
                    </div>
                  </Fragment>
                )}

                <P {...styles.p}>
                  Weitere Einstellungen finden Sie im <Link route='account'>
                    <a {...linkRule}>
                      Konto
                    </a>
                  </Link>.
                </P>
                <P {...styles.p}>
                  Falls Sie weitere Fragen zur Nutzung der Republik haben, lesen Sie unsere <a href='' {...linkRule}>Gebrauchsanweisungen</a> oder <a href='' {...linkRule}>FAQs</a>.
                </P>
                <P {...styles.p}>
                  Nötigenfalls steht Ihnen auch unser Erste-Hilfe-Team Rede und Antwort unter <a href='' {...linkRule}>kontakt@republik.ch</a>.
                </P>
              </Center>
            )
          }}
        </Query>
      </Frame>
    )
  }
}

export default withRouter(Page)
