import React, { Fragment } from 'react'
import voteT from '../voteT'
import md from 'markdown-in-js'
import { mdComponents } from '../text'

const VoteInfo = ({ vt }) => (
  <Fragment>
    {md(mdComponents)`
# Herzlich willkommen auf unserer Abstimmungsplattform!

Abstimmungsberechtigt sind alle, die vor dem Abstimmungsbeginn ein [Jahresabo](https://www.republik.ch/angebote) der Republik haben.
    `}
  </Fragment>
)

export default voteT(VoteInfo)
