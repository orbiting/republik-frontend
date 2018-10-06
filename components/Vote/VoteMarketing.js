import React from 'react'
import { Body, Section, Title } from './text'
import voteT from './voteT'
import { Container } from '@project-r/styleguide'

const VoteMarketing = ({vt}) =>
  <Container>
    <Section>
      <Title>{vt('vote/title')}</Title>
      <Body dangerousHTML={vt('info/marketing/intro')} />
    </Section>
  </Container>

export default voteT(VoteMarketing)
