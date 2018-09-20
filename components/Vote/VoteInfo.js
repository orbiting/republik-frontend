import React, {Fragment} from 'react'
import { Heading, Section, Strong, TextMedium, Body, Small, Title } from './text'
import { Router } from '../../lib/routes'
import Collapsible from './Collapsible'
import { formatter as f } from './util'

import {
  A, Button, P
} from '@project-r/styleguide'

const F = Fragment

export default () =>
  <div>
    <P>
      <img style={{width: '100%'}} src='/static/genossenschaft/info2.png' />
    </P>
    <Section>
      <Title>{f('vote/title')}</Title>
      <Body text={f('info/intro/body1')} />
      <P>
        <Button block big onClick={e => { e.preventDefault(); Router.pushRoute(`voteSubmit`).then(() => window.scrollTo(0, 0)) }}>Kandidieren Sie jetzt!</Button>
      </P>
      <Body text={f('info/intro/body2')} />
      <Collapsible>
        <Small text={f('info/intro/more')} />
      </Collapsible>
    </Section>
    <P>
      <img style={{width: '100%'}} src='/static/genossenschaft/info1.jpg' />
    </P>
    <Section>
      <Heading>Genossenschaftsrat</Heading>
      <Body text={f('info/council/body')}/>
      <Collapsible>
        <Small text={f('info/council/more')}/>
      </Collapsible>
      <Body text={f('info/council/body2')}/>
      <Collapsible label='Weitere Informationen zur Wahl'>
        <Small text={f('info/council/more2')}/>
      </Collapsible>
    </Section>
    <F>
      <Button block big onClick={e => { e.preventDefault(); Router.pushRoute(`voteSubmit`).then(() => window.scrollTo(0, 0)) }}>Kandidieren Sie jetzt!</Button>
    </F>
  </div>
