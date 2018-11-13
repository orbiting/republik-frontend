import React, { Component } from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import withT from '../../lib/withT'

import GroupedFormats from './GroupedFormats'
import Latest from './Latest'

import {
  Center,
  Interaction,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  container: css({
    padding: '30px 15px 120px',
    [mediaQueries.mUp]: {
      maxWidth: '695px',
      padding: '60px 0 120px'
    }
  }),
  latest: css({
    margin: '60px 0 20px 0',
    [mediaQueries.mUp]: {
      margin: '100px 0 40px 0'
    }
  })
}

class Formats extends Component {
  render () {
    const { t } = this.props
    return (
      <Center {...styles.container}>
        <GroupedFormats />
        <Interaction.H2 {...styles.latest}>
          {t('formats/latest')}
        </Interaction.H2>
        <Latest />
      </Center>
    )
  }
}

export default compose(withT)(Formats)
