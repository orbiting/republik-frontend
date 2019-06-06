import React from 'react'
import { Body, Heading, Section, Small, Title } from '../text'
import Collapsible from '../Collapsible'
import { FigureCaption, FigureImage, NarrowContainer, P } from '@project-r/styleguide'
import { CDN_FRONTEND_BASE_URL } from '../../../lib/constants'
import voteT from '../voteT'

const VoteInfo = ({ vt }) =>
  <NarrowContainer>
    <Title>{vt('info/title')}</Title>
    <Body dangerousHTML={vt('info/intro/body1')} />
    <Body dangerousHTML={vt('info/intro/body2')} />
    <Collapsible>
      <Small dangerousHTML={vt('info/intro/more')} />
    </Collapsible>
    <P>
      <FigureImage src={`${CDN_FRONTEND_BASE_URL}/static/genossenschaft/info1.jpg?resize=650x`} />
      <FigureCaption>{vt('vote/intro/caption')}</FigureCaption>
    </P>
    <Section>
      <Heading>Genossenschaftsrat</Heading>
      <Body dangerousHTML={vt('info/council/body')} />
      <Collapsible label='Weitere Informationen zum Genossenschaftsrat'>
        <Small dangerousHTML={vt('info/council/more')} />
      </Collapsible>
      <Body dangerousHTML={vt('info/council/body2')} />
      <Collapsible label='Weitere Informationen zur Wahl'>
        <Small dangerousHTML={vt('info/council/more2')} />
      </Collapsible>
    </Section>
    <P>
      <Body dangerousHTML={vt('info/footer')} />
    </P>
  </NarrowContainer>

export default voteT(VoteInfo)
