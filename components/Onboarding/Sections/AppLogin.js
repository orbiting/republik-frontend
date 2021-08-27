import React from 'react'
import gql from 'graphql-tag'
import { css } from 'glamor'

import { Interaction, A } from '@project-r/styleguide'

import Section from '../Section'
import {
  CDN_FRONTEND_BASE_URL,
  ASSETS_SERVER_BASE_URL
} from '../../../lib/constants'
import withT from '../../../lib/withT'

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

const AppLogin = props => {
  const { user, t } = props
  const hasDevices = user && user.devices && !!user.devices.length

  return (
    <Section
      heading={t('Onboarding/Sections/AppLogin/heading')}
      isTicked={hasDevices}
      {...props}
    >
      <P {...styles.p}>
        {t.first(
          [
            `Onboarding/Sections/AppLogin/hasDevice/${!!hasDevices}/paragraph1`,
            'Onboarding/Sections/AppLogin/paragraph1'
          ],
          null,
          ''
        )}
      </P>
      <P {...styles.p}>
        {t.first(
          [
            `Onboarding/Sections/AppLogin/hasDevice/${!!hasDevices}/paragraph2`,
            'Onboarding/Sections/AppLogin/paragraph2'
          ],
          null,
          ''
        )}
      </P>
      <P {...styles.p}>
        {t.first(
          [
            `Onboarding/Sections/AppLogin/hasDevice/${!!hasDevices}/paragraph3`,
            'Onboarding/Sections/AppLogin/paragraph3'
          ],
          null,
          ''
        )}
      </P>
      <P {...styles.p}>
        {t('Onboarding/Sections/AppLogin/ios')}
        <br />
        <A href='https://itunes.apple.com/ch/app/republik/id1392772910'>
          <img
            src={`${CDN_FRONTEND_BASE_URL}/static/apple-store-badge.png`}
            height='54'
            alt={t('Onboarding/Sections/AppLogin/ios/alt')}
          />
        </A>
      </P>
      <P {...styles.p}>
        {t('Onboarding/Sections/AppLogin/android')}
        <br />
        <A href='https://play.google.com/store/apps/details?id=app.republik'>
          <img
            src={`${CDN_FRONTEND_BASE_URL}/static/google-play-badge.png`}
            height='54'
            alt={t('Onboarding/Sections/AppLogin/android/alt')}
          />
        </A>
      </P>
      <P {...styles.p}>
        {t('Onboarding/Sections/AppLogin/apk')}
        <br />
        <A
          href={`${ASSETS_SERVER_BASE_URL}/s3/republik-assets/assets/app/republik-2.0.1.apk`}
        >
          {t('Onboarding/Sections/AppLogin/apk/link')}
        </A>
      </P>
    </Section>
  )
}

export default withT(AppLogin)
