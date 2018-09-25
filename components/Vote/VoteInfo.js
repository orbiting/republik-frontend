import React, { Fragment } from 'react'
import { Heading, Section, Caption, Body, Small, Title } from './text'
import { Link } from '../../lib/routes'
import Collapsible from './Collapsible'
import { formatter as f } from './util'
import {
  FigureImage,
  FigureCaption
} from '@project-r/styleguide'
import {
  A, Button, P
} from '@project-r/styleguide'
import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'

const voteNow =
  <P>
    <Link route='voteSubmit'>
      <Button block big primary>
        Kandidieren Sie jetzt!
      </Button>
    </Link>
  </P>

export default ({url}) =>
  <div>
    <Section>
      <Title>{f('vote/title')}</Title>
      <Body text={f('info/intro/body1')}/>
      {voteNow}
      <Body text={f('info/intro/body2')}/>
      <Collapsible>
        <Small text={f('info/intro/more')}/>
      </Collapsible>
    </Section>
    <P>
      <FigureImage src={`${CDN_FRONTEND_BASE_URL}/static/genossenschaft/info1.jpg`} />
      <FigureCaption>{f('vote/intro/caption')}</FigureCaption>
    </P>
    <Section>
      <Heading>Genossenschaftsrat</Heading>
      <Body text={f('info/council/body')}/>
      <Collapsible label='Weitere Informationen zum Genossenschaftsrat'>
        <Small text={f('info/council/more')}/>
      </Collapsible>
      <Body text={f('info/council/body2')}/>
      <Collapsible label='Weitere Informationen zur Wahl'>
        <Small text={f('info/council/more2')}/>
      </Collapsible>
    </Section>
    {voteNow}
  </div>
