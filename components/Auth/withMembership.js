import React, { Fragment } from 'react'
import compose from 'lodash/flowRight'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import withInNativeApp from '../../lib/withInNativeApp'

import Frame from '../Frame'
import SignIn from './SignIn'
import Me from './Me'

import { Interaction, Editorial, A } from '@project-r/styleguide'

import withAuthorization, { PageCenter } from './withAuthorization'
import { withMembership } from './checkRoles'
import Link from 'next/link'

export const UnauthorizedMessage = compose(
  withT,
  withInNativeApp
)(
  ({
    t,
    me,
    inNativeIOSApp,
    unauthorizedTexts: { title, description } = {}
  }) => {
    if (inNativeIOSApp) {
      return (
        <Fragment>
          {me && (
            <Interaction.H1 style={{ marginBottom: 10 }}>
              {t('withMembership/ios/unauthorized/title')}
            </Interaction.H1>
          )}
          <br />
          <Me
            beforeSignedInAs={
              <Fragment>
                <Interaction.P style={{ marginBottom: 20 }}>
                  {t('withMembership/ios/unauthorized/noMembership')}
                </Interaction.P>
                <Interaction.P style={{ marginBottom: 20 }}>
                  {t.elements('withMembership/ios/unauthorized/claimText', {
                    claimLink: (
                      <Link href='/abholen' key='claim' passHref>
                        <Editorial.A>
                          {t('withMembership/ios/unauthorized/claimLink')}
                        </Editorial.A>
                      </Link>
                    )
                  })}
                </Interaction.P>
              </Fragment>
            }
            beforeSignInForm={
              <Fragment>
                <Interaction.P style={{ marginBottom: 20 }}>
                  {t('withMembership/ios/unauthorized/signIn')}
                </Interaction.P>
                <Interaction.P>
                  {t.elements('withMembership/ios/unauthorized/claimText', {
                    claimLink: (
                      <Link href='/abholen' key='claim' passHref>
                        <Editorial.A>
                          {t('withMembership/ios/unauthorized/claimLink')}
                        </Editorial.A>
                      </Link>
                    )
                  })}
                </Interaction.P>
              </Fragment>
            }
          />
        </Fragment>
      )
    }
    if (me) {
      return (
        <Fragment>
          <Interaction.H1>{t('withMembership/title')}</Interaction.H1>
          <Interaction.P>
            {t.elements('withMembership/unauthorized', {
              buyLink: (
                <Link key='pledge' href='/angebote' passHref>
                  <A>{t('withMembership/unauthorized/buyText')}</A>
                </Link>
              ),
              accountLink: (
                <Link key='account' href='/konto' passHref>
                  <A>{t('withMembership/unauthorized/accountText')}</A>
                </Link>
              )
            })}
            <br />
          </Interaction.P>
          <br />
          <Me />
        </Fragment>
      )
    }
    return (
      <Fragment>
        <Interaction.H1>{title || t('withMembership/title')}</Interaction.H1>
        <br />
        <SignIn
          beforeForm={
            <Interaction.P style={{ marginBottom: 20 }}>
              {description ||
                t.elements('withMembership/signIn/note', {
                  buyLink: (
                    <Link key='pledge' href='/angebote' passHref>
                      <A>{t('withMembership/signIn/note/buyText')}</A>
                    </Link>
                  ),
                  moreLink: (
                    <Link key='index' href='/' passHref>
                      <A>{t('withMembership/signIn/note/moreText')}</A>
                    </Link>
                  )
                })}
            </Interaction.P>
          }
        />
      </Fragment>
    )
  }
)

export const UnauthorizedPage = ({ me, meta, unauthorizedTexts }) => (
  <Frame meta={meta} raw>
    <PageCenter>
      <UnauthorizedMessage {...{ me, unauthorizedTexts }} />
    </PageCenter>
  </Frame>
)

export const WithoutMembership = withAuthorization(['member'])(
  ({ isAuthorized, render }) => {
    if (!isAuthorized) {
      return render()
    }
    return null
  }
)

export const WithoutActiveMembership = compose(
  withMe,
  withAuthorization(['member'])
)(({ me, render }) => {
  if (me && me.activeMembership) {
    return null
  }

  return render()
})

export const WithMembership = withAuthorization(['member'])(
  ({ isAuthorized, render }) => {
    if (isAuthorized) {
      return render()
    }
    return null
  }
)

export const WithActiveMembership = compose(
  withMe,
  withAuthorization(['member'])
)(({ me, render }) => {
  if (me && me.activeMembership) {
    return render()
  }

  return null
})

export const enforceMembership = (
  meta,
  unauthorizedTexts
) => WrappedComponent =>
  withAuthorization(['member'])(({ isAuthorized, me, ...props }) => {
    if (isAuthorized) {
      return <WrappedComponent meta={meta} me={me} {...props} />
    }
    return <UnauthorizedPage {...{ me, meta, unauthorizedTexts }} />
  })

export default withMembership
