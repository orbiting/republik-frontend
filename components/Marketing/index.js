import React from 'react'

import {css} from 'glamor'
import SignUp from './SignUp'
import { H1 } from '@project-r/styleguide'

const styles = {
  center: css({
    width: '100%',
    maxWidth: '540px',
    margin: '20vh auto',
    padding: 20
  })
}

export default () =>
  <div {...styles.center}>
    <H1>Es ist Zeit.</H1>
    <SignUp showMemberships />
  </div>
