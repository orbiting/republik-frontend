import React, { Component } from 'react'

import { compose } from 'redux'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import { H1 } from '@project-r/styleguide'

class Me extends Component {
  render () {
    const { me, t } = this.props

    return (
      <div>
        <H1>{t('me/pageTitle', {name: me.name})}</H1>
      </div>
    )
  }
}

export default compose(withMe, withT)(Me)
