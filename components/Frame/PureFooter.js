import React, { Component } from 'react'
import { css } from 'glamor'
import 'glamor/reset'
import Router from 'next/router'
import track from '../../lib/piwik'
import IconLink from '../IconLink'
import { mediaQueries, fontFamilies, Label } from '@project-r/styleguide'
import { EMAIL_CONTACT } from '../constants'

css.global('html', { boxSizing: 'border-box' })
css.global('*, *:before, *:after', { boxSizing: 'inherit' })

export const SPACE = 60

const linkRule = css({
  textDecoration: 'none',
  color: 'inherit',
  ':hover': {
    opacity: 0.6
  }
})

export const A = ({ children, ...props }) => (
  <a {...props} {...linkRule}>
    {children}
  </a>
)

const styles = {
  container: css({
    marginTop: SPACE * 2,
    paddingBottom: SPACE,
    textAlign: 'center'
  }),
  nav: css({
    marginTop: SPACE,
    marginBottom: SPACE,
    [mediaQueries.mUp]: {
      marginTop: SPACE,
      marginBottom: SPACE * 2
    }
  }),
  mainNav: css({
    fontFamily: fontFamilies.sansSerifRegular,
    fontSize: 44,
    lineHeight: '60px'
  }),
  address: css({
    lineHeight: 1.6,
    fontStyle: 'normal'
  })
}

class Footer extends Component {
  componentDidMount () {
    Router.onRouteChangeComplete = url => {
      clearTimeout(this.timeout)
      this.setState({ loading: false })

      // update url manually, seems necessary after client navigation
      track(['setCustomUrl', window.location.href])
      track(['trackPageView'])
    }
  }
  componentWillUnmount () {
    Router.onRouteChangeComplete = null
  }
  render () {
    const { inverted, en } = this.props

    return (
      <div {...styles.container}>
        <div {...styles.nav}>
          {!!en && <Label>Read more in German</Label>}
          <div {...styles.mainNav}>
            <br />
            <A href='https://project-r.construction/' target='_blank'>
              Project R
            </A>
          </div>
        </div>

        <address {...styles.address} style={{ marginBottom: 20 }}>
          <A href='https://goo.gl/maps/j1F8cXQhrmo' target='_blank'>
            Republik<br />
            c/o Hotel Rothaus<br />
            Sihlhallenstrasse 1<br />
            8004 Zürich<br />
            {!!en && (
              <span>
                Switzerland<br />
              </span>
            )}
          </A>
          <A href={`mailto:${EMAIL_CONTACT}`}>{EMAIL_CONTACT}</A>
        </address>

        <IconLink
          fill={inverted ? '#fff' : '#000'}
          icon='facebook'
          href='https://www.facebook.com/RepublikMagazin'
          target='_blank'
        />
        <IconLink
          fill={inverted ? '#fff' : '#000'}
          icon='twitter'
          href='https://twitter.com/RepublikMagazin'
          target='_blank'
        />
      </div>
    )
  }
}

export default Footer
