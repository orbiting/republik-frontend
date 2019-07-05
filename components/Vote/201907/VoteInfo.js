import React, { Fragment } from 'react'
import { Body, Title } from '../text'
import voteT from '../voteT'

const VoteInfo = ({ vt }) =>
  <Fragment>
    <Title>{vt('info/201907/title')}</Title>
    <Body dangerousHTML={vt('info/201907/intro/body1')} />
  </Fragment>

export default voteT(VoteInfo)
