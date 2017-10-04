import React, { Component } from 'react'

import { compose } from 'redux'
import withT from '../../lib/withT'
import { H1 } from '@project-r/styleguide'

class Me extends Component {
  render () {
    const { t } = this.props

    return (
      <div>
        <H1>{t('me/pageTitle')}</H1>
      </div>
    )
  }
}

export default compose(withT)(Me)
