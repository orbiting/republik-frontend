import React, { Component } from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'

import { Label, A, mediaQueries } from '@project-r/styleguide'

import withT from '../../lib/withT'
import jsonp from '../../lib/utils/jsonp'
import { PIWIK_URL_BASE } from '../../lib/constants'

import Anchor from '../Anchor'

class OptOut extends Component {
  constructor(...args) {
    super(...args)
    this.state = {}
  }
  change(turn) {
    this.setState({ status: 'saving' })
    const action = turn === 'off' ? 'doIgnore' : 'doTrack'
    jsonp(
      `${PIWIK_URL_BASE}/index.php?module=API&method=AjaxOptOut.${action}&format=json`,
      {},
      (error, data) => {
        if (error || data.result !== 'success') {
          this.setState({ status: 'fail' })
          return
        }
        this.loadStatus()
      }
    )
  }
  loadStatus() {
    this.setState({ status: 'loading' })
    jsonp(
      `${PIWIK_URL_BASE}/index.php?module=API&method=AjaxOptOut.isTracked&format=json`,
      {},
      (error, data) => {
        if (error) {
          this.setState({ status: 'timeout' })
          return
        }

        this.setState({ status: data.value ? 'on' : 'off' })
      }
    )
  }
  componentDidMount() {
    if (navigator.doNotTrack) {
      this.setState({ status: 'dnt' })
    } else {
      this.loadStatus()
    }
  }
  render() {
    const { t } = this.props
    const { status } = this.state

    return (
      <span>
        <Anchor id='tracking' />
        <Label>{t('piwik/optOut/label')}</Label>
        <br />
        {!!status && t(`piwik/optOut/status/${status}`)}
        {(status === 'off' || status === 'on') && (
          <A
            href='#tracking'
            onClick={e => {
              e.preventDefault()
              this.change(status === 'off' ? 'on' : 'off')
            }}
          >
            {' '}
            {t(`piwik/optOut/turn/${status === 'off' ? 'on' : 'off'}`)}
          </A>
        )}
        <noscript>{t('piwik/optOut/noscript')}</noscript>
      </span>
    )
  }
}

export default compose(withT)(OptOut)
