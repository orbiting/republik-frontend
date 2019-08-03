import React, { Fragment } from 'react'
import gql from 'graphql-tag'
import { css } from 'glamor'

import { Interaction, linkRule } from '@project-r/styleguide'

import Section from '../Section'
import { CDN_FRONTEND_BASE_URL } from '../../../lib/constants'

const { P } = Interaction

const styles = {
  p: css({
    marginBottom: 20
  })
}

export const fragments = {
  user: gql`
    fragment AppLoginUser on User {
      id
      devices {
        id
      }
    }
  `
}

export default (props) => {
  const { user } = props
  const hasDevices = user && user.devices && !!user.devices.length

  return (
    <Section
      heading='App und Login'
      isTicked={hasDevices}
      {...props}>
      {hasDevices ? (
        <Fragment>
          <P {...styles.p}>Sie nutzen bereits die Republik-App.</P>
          <P {...styles.p}>Die App können Sie auf einer beliebigen Anzahl von Geräten installieren.</P>
        </Fragment>
      ) : (
        <Fragment>
          <P {...styles.p}>Wir empfehlen Ihnen unsere App.</P>
          <P {...styles.p}>Bei der Republik melden Sie sich ohne Passwort an, sondern über einen Bestätigungs-Link an Ihre E-Mail-Adresse.</P>
          <P {...styles.p}>Ganz einfach geht das mit der App: Anstatt eines Bestätigungs-Links schicken wir Ihnen eine Push-Notification aufs Handy.</P>
        </Fragment>
      )}
      <P {...styles.p}>
        iPhone oder iPad:<br />
        <a href='https://itunes.apple.com/ch/app/republik/id1392772910' {...linkRule}>
          <img
            src={`${CDN_FRONTEND_BASE_URL}/static/apple-store-badge.png`}
            height='54'
            alt='Im Apple App Store erhältlich' />
        </a>
      </P>
      <P {...styles.p}>
        Android-Geräte:<br />
        <a href='https://play.google.com/store/apps/details?id=app.republik' {...linkRule}>
          <img
            src={`${CDN_FRONTEND_BASE_URL}/static/google-play-badge.png`}
            height='54'
            alt='Bei Google Play erhältlich' />
        </a>
      </P>
      <P {...styles.p}>
        APK für Android:<br />
        <a href='https://cdn.republik.space/s3/republik-assets/assets/app/republik-1.0.3.apk' {...linkRule}>APK herunterladen</a>
      </P>
    </Section>
  )
}
