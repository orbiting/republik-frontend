import React from 'react'
import Frame from '../Frame'
import withMe from '../../lib/apollo/withMe'
import Poll from './Poll'
import { compose } from 'react-apollo'
import {
  Interaction,
  mediaQueries,
  A
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

import Election from './Election'
import { Router } from '../../lib/routes'
import { css } from 'glamor'
import Collapsible from './Collapsible'

const {H2, P} = Interaction

const blindtext = (numParagraphs = 1, wrapInP = true) => {
  const lorem = `Ihr naht euch wieder, schwankende Gestalten! Die früh sich einst dem trüben
                 Blick gezeigt. Versuch’ ich wohl euch diesmal fest zu halten? Fühl’ ich
                 mein Herz noch jenem Wahn geneigt? Ihr drängt euch zu! nun gut, so mögt ihr
                 walten. Wie ihr aus Dunst und Nebel um mich steigt. `
  const res = wrapInP ? <P>{lorem}</P> : lorem
  return Array.from(Array(numParagraphs).keys()).map((_, i) => res)
}

const styles = {
  section: css({
    margin: '30px 0'
  }),
  anchor: css({
    display: 'block',
    position: 'relative',
    visibility: 'hidden',
    top: -HEADER_HEIGHT_MOBILE,
    [mediaQueries.lUp]: {
      top: -HEADER_HEIGHT
    }
  })
}

class Page extends React.Component {
  render () {
    const meta = {
      title: 'Wahl des Genossenschaftsrats',
      description: 'Bestimme über die Zukunft der Republik!'
    }

    const {url} = this.props

    const options = [
      {value: 'yes', label: 'Ja'},
      {value: 'no', label: 'Nein'}
    ]

    return (
      <Frame meta={meta} url={url} disableNavBar>
        <div style={{marginTop: 0}}>
          <Interaction.Headline>Wahlen und Abstimmungen</Interaction.Headline>
          {blindtext(2)}
          <P>
            <A onClick={e => { e.preventDefault(); Router.push('kandidieren') }}>Kandidieren Sie jetzt!</A>
          </P>
          <Collapsible>
            {blindtext(3, false)}
          </Collapsible>
          <section {...styles.section}>
            <a {...styles.anchor} id='jahresrechnung' />
            <H2>Jahresrechnung</H2>
            {blindtext()}
            <Collapsible>
              {blindtext(3, false)}
            </Collapsible>
            <Poll
              proposition='Wollen Sie die Jahresrechnung 2017 annehmen?'
              options={options}
            />
          </section>

          <section {...styles.section}>
            <a {...styles.anchor} id='revisionsbericht' />
            <H2>Revisionsbericht</H2>
            {blindtext()}
            <Collapsible>
              {blindtext(3, false)}
            </Collapsible>
            <Poll
              proposition='Wollen Sie den Revisionsbericht 2017 annehmen?'
              options={options}
            />
          </section>

          <section {...styles.section}>
            <a {...styles.anchor} id='budget' />
            <H2>Budget</H2>
            {blindtext()}
            <Collapsible>
              {blindtext(3, false)}
            </Collapsible>
            <Poll
              proposition='Wollen Sie das Budget 2018 annehmen?'
              options={options}
            />
          </section>

          <section {...styles.section}>
            <a {...styles.anchor} id='präsidium' />
            <H2>Präsidium</H2>
            {blindtext()}
            <Collapsible>
              {blindtext(3, false)}
            </Collapsible>
            <Election
              slug='genossenschaftsrat2018-president'
            />
          </section>

          <section {...styles.section}>
            <a {...styles.anchor} id='genossenschaftsrat' />
            <H2>Genossenschaftsrat</H2>
            {blindtext()}
            <Collapsible>
              {blindtext(5, false)}
            </Collapsible>
            <Election
              slug='genossenschaftsrat2018-members'
              isSticky
            />
          </section>

        </div>
      </Frame>
    )
  }
}

export default compose(
  withMe
)(Page)
