import React from 'react'
import { Body, Section, Title } from './text'
import voteT from './voteT'

const VoteMarketing = ({url, vt}) =>
  <div>
    <Section>
      <Title>{vt('vote/title')}</Title>
      <Body text={vt('info/marketing/intro')} />
    </Section>
  </div>

export default voteT(VoteMarketing)
