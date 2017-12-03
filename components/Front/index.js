import React, { Component } from 'react'

import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import { H1 } from '@project-r/styleguide'

import { HEADER_HEIGHT } from '../constants'

class Front extends Component {
  render () {
    const { t } = this.props

    return (
      <div style={{backgroundColor: '#ddd', padding: '40vh 0', height: `calc(100vh - ${HEADER_HEIGHT}px)`}}>
        <H1 style={{textAlign: 'center'}}>{t('pages/magazine/title')}</H1>
      </div>
    )
  }
}

export default compose(withT)(Front)
