import React, { Fragment } from 'react'
import { compose } from 'react-apollo'

import { css } from 'glamor'
import Footer from '../Footer'
import SignIn from '../../Auth/SignIn'
import SignOut from '../../Auth/SignOut'
import { Link, matchPath, Router } from '../../../lib/routes'
import withT from '../../../lib/withT'
import withInNativeApp from '../../../lib/withInNativeApp'
import { prefixHover } from '../../../lib/utils/hover'

import NavBar from '../NavBar'
import withMembership from '../../Auth/withMembership'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'

import { colors, fontStyles, Interaction, mediaQueries } from '@project-r/styleguide'
import voteT from '../../Vote/voteT'

const styles = {
  container: css({
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column'
  }),
  hr: css({
    margin: 0,
    display: 'block',
    border: 0,
    height: 1,
    color: colors.divider,
    backgroundColor: colors.divider,
    width: '100%'
  }),
  hrFixed: css({
    position: 'fixed',
    top: HEADER_HEIGHT_MOBILE - 1,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT - 1
    }
  }),
  sections: css({
    ...fontStyles.sansSerifRegular21,
    flexGrow: 1,
    marginBottom: 20,
    paddingTop: '20px',
    [mediaQueries.mUp]: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }),
  section: css({
    margin: '0px 20px',
    '& + &': {
      borderTop: `1px solid ${colors.divider}`,
      margin: '25px 20px',
      paddingTop: '25px'
    },
    [mediaQueries.mUp]: {
      '& + &': {
        borderTop: 'none',
        margin: '0 50px',
        padding: '0 50px'
      },
      '&:first-child': {
        paddingLeft: '25px'
      },
      '&:last-child': {
        marginRight: 0,
        paddingRight: '25px',
        textAlign: 'right'
      }
    }
  }),
  link: css({
    textDecoration: 'none',
    color: colors.text,
    ':visited': {
      color: colors.text
    },
    [prefixHover()]: {
      color: colors.primary
    },
    cursor: 'pointer',
    [mediaQueries.mUp]: {
      fontSize: 34,
      lineHeight: '60px'
    }
  })
}

const SignoutLink = ({children, ...props}) => (
  <a {...styles.link} {...props}>{children}</a>
)

const NavLink = ({ route, translation, params = {}, active, closeHandler }) => {
  if (
    active &&
    active.route === route
  ) {
    return (
      <a
        {...styles.link}
        style={{ cursor: 'pointer' }}
        onClick={e => {
          e.preventDefault()
          Router.replaceRoute(route, params)
            .then(() => {
              window.scroll(0, 0)
              closeHandler()
            })
        }}
      >
        {translation}
      </a>
    )
  }
  return (
    <Link route={route} params={params}>
      <a {...styles.link}>{translation}</a>
    </Link>
  )
}

const Nav = ({me, url, closeHandler, children, t, vt, inNativeApp, inNativeIOSApp, isMember}) => {
  const active = matchPath(url.asPath)
  return (
    <div {...styles.container} id='nav'>
      <hr {...styles.hr} {...styles.hrFixed} />
      {isMember && <Fragment>
        <NavBar url={url} />
        <hr {...styles.hr} />
      </Fragment>}
      <div {...styles.sections}>
        <div {...styles.section}>
          {me && (
            <div>
              <NavLink
                route='account'
                translation={t('Frame/Popover/myaccount')}
                active={active}
                closeHandler={closeHandler}
              />
              <br />
              {me.accessCampaigns.length > 0 &&
                <Fragment>
                  <a
                    {...styles.link}
                    style={{ cursor: 'pointer' }}
                    href='/konto#teilen'
                    onClick={(e) => {
                      if (e.currentTarget.nodeName === 'A' &&
                      (e.metaKey || e.ctrlKey || e.shiftKey || (e.nativeEvent && e.nativeEvent.which === 2))) {
                        // ignore click for new tab / new window behavior
                        return
                      }

                      Router
                        .pushRoute('/konto#teilen')
                        .then(closeHandler)
                    }}>
                    {t('nav/share')}
                  </a>
                  <br />
                </Fragment>
              }
              <NavLink
                route='profile'
                params={{ slug: me.username || me.id }}
                translation={t('Frame/Popover/myprofile')}
                active={active}
                closeHandler={closeHandler}
              />
              <br />
            </div>
          )}
          {me ? (
            <SignOut Link={SignoutLink} />
          ) : (
            <SignIn beforeForm={(
              <Interaction.P style={{ marginBottom: '20px' }}>
                {t('me/signedOut')}
              </Interaction.P>
            )} />
          )}
          <br />
        </div>
        <div {...styles.section}>
          <NavLink
            route='community'
            translation={t('nav/community')}
            active={active}
            closeHandler={closeHandler}
          />
          <br />
          {/**
           <NavLink
             route='vote'
             translation={vt('common/hamburgerEntry')}
             active={active}
             closeHandler={closeHandler}
           />
           <br />
          **/}
          <NavLink
            route='events'
            translation={t('nav/events')}
            active={active}
            closeHandler={closeHandler}
          />
          <br />
          {!inNativeIOSApp && (
            <Fragment>
              <NavLink
                route='pledge'
                params={me ? { package: 'ABO_GIVE' } : undefined}
                translation={t(me ? 'nav/give' : 'nav/offers')}
                active={active}
                closeHandler={closeHandler}
              />
              <br />
            </Fragment>
          )}
          <NavLink
            route='legal/imprint'
            translation={t('nav/team')}
            active={active}
            closeHandler={closeHandler}
          />
          <br />
        </div>
      </div>
      {inNativeApp && <Footer />}
    </div>
  )
}

export default compose(
  withT,
  voteT,
  withInNativeApp,
  withMembership
)(Nav)
