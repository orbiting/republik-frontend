import React, {Fragment} from 'react'
import { css } from 'glamor'
import { Heading, Section, Strong, TextMedium, Body, Small, Title } from './text'
import Collapsible from './Collapsible'
import Poll from './Poll'
import Election from './Election'
import {
  mediaQueries,
  A
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { formatter as f } from './util'

const F = Fragment

const styles = {
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

const options = [
  {value: 'yes', label: 'Ja'},
  {value: 'no', label: 'Nein'},
  {value: 'abstain', label: 'Leer einlegen'}
]

export default () =>
  <div style={{marginTop: 0}}>
    <Section>
      <Title>{f('vote/title')}</Title>
      <Body text={f('vote/intro/body')}/>
      <Collapsible>
        <Small text={f('vote/intro/more')}/>
      </Collapsible>
    </Section>
    <Section>
      <a {...styles.anchor} id='jahresrechnung' />
      <Heading>Jahresrechnung</Heading>
      <Body text={f('vote/jahresrechnung/body')}/>
      <Collapsible>
        <Small text={f('vote/jahresrechnung/more')}/>
      </Collapsible>
      <Poll
        proposition='Wollen Sie die Jahresrechnung 2017/18 annehmen?'
        options={options}
      />
    </Section>

    <Section>
      <a {...styles.anchor} id='revisionsbericht' />
      <Heading>Revisionsbericht</Heading>
      <Body text={f('vote/revisionsbericht/body')}/>
      <Collapsible>
        <Small text={f('vote/revisionsbericht/more')}/>
      </Collapsible>
      <Poll
        proposition='Wollen Sie den Revisionsbericht 2017/18 annehmen?'
        options={options}
      />
    </Section>

    <Section>
      <a {...styles.anchor} id='budget' />
      <Heading>Budget</Heading>
      <Body text={f('vote/budget/body')}/>
      <Collapsible>
        <Small text={f('vote/budget/more')}/>
      </Collapsible>
      <Poll
        proposition='Wollen Sie das Budget 2018/19 annehmen?'
        options={options}
      />
    </Section>

    <Section>
      <a {...styles.anchor} id='president' />
      <Heading>Präsidium</Heading>
      <Body text={f('vote/president/body')}/>
      <Collapsible>
        <Small text={f('vote/president/more')}/>
      </Collapsible>
      <Election
        slug='genossenschaftsrat2018-president'
      />
    </Section>

    <Section>
      <a {...styles.anchor} id='genossenschaftsrat' />
      <Heading>Genossenschaftsrat</Heading>
      <Body text={f('vote/members/body')}/>
      <Collapsible>
        <Small text={f('vote/members/more')}/>
      </Collapsible>
      <Election
        slug='genossenschaftsrat2018-members'
        isSticky
      />
    </Section>

  </div>
