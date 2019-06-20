import React from 'react'
import { Body, Title } from '../text'
import { NarrowContainer } from '@project-r/styleguide'
import voteT from '../voteT'

const VoteInfo = ({ vt }) =>
  <NarrowContainer>
    <Title>{vt('info/201907/title')}</Title>
    <Body dangerousHTML={vt('info/201907/intro/body1')} />
  </NarrowContainer>

export default voteT(VoteInfo)
