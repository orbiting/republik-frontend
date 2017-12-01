import React, { Component } from 'react'

import { compose } from 'redux'
import withT from '../../lib/withT'
import { H1 } from '@project-r/styleguide'

class Front extends Component {
  render () {
    const { t } = this.props

    return (
      <div style={{backgroundColor: '#ddd', padding: '20vh 0'}}>
        <H1 style={{textAlign: 'center'}}>{t('pages/magazine/title')}</H1>
      </div>
    )
  }
}

export default compose(withT)(Front)
