import React from 'react'
import { Body, Heading, Section, Small, Title } from './text'
import { Link } from '../../lib/routes'
import Collapsible from './Collapsible'
import { Button, FigureCaption, FigureImage, P } from '@project-r/styleguide'
import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'
import voteT from './voteT'

const voteNow =
  <P>
    <Link route='voteSubmit'>
      <Button block big primary>
        Kandidieren Sie jetzt!
      </Button>
    </Link>
  </P>

const VoteInfo = ({url, vt}) =>
  <div>
    <Section>
      <Title>{vt('vote/title')}</Title>
      <Body text={vt('info/intro/body1')} />
      {voteNow}
      <Body text={vt('info/intro/body2')} />
      <Collapsible>
        <Small text={vt('info/intro/more')} />
      </Collapsible>
    </Section>
    <P>
      <FigureImage src={`${CDN_FRONTEND_BASE_URL}/static/genossenschaft/info1.jpg`} />
      <FigureCaption>{vt('vote/intro/caption')}</FigureCaption>
    </P>
    <Section>
      <Heading>Genossenschaftsrat</Heading>
      <Body text={vt('info/council/body')} />
      <Collapsible label='Weitere Informationen zum Genossenschaftsrat'>
        <Small text={vt('info/council/more')} />
      </Collapsible>
      <Body text={vt('info/council/body2')} />
      <Collapsible label='Weitere Informationen zur Wahl'>
        <Small text={vt('info/council/more2')} />
      </Collapsible>
    </Section>
    {voteNow}
  </div>

export default voteT(VoteInfo)
