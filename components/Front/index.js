import React, { Component } from 'react'

import { compose } from 'redux'
import withT from '../../lib/withT'
import { H1 } from '@project-r/styleguide'

class Front extends Component {
  render () {
    const { t } = this.props

    return (
      <div>
        <H1>{t('magazine/pageTitle')}</H1>
      </div>
    )
  }
}

export default compose(withT)(Front)
