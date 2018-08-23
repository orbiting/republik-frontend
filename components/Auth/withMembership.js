import React, { Fragment } from 'react'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'
import { Link } from '../../lib/routes'
import withInNativeApp from '../../lib/withInNativeApp'

import Frame from '../Frame'
import SignIn from './SignIn'
import Me from './Me'

import { Interaction, linkRule } from '@project-r/styleguide'

import withAuthorization, { PageCenter } from './withAuthorization'

const UnauthorizedMessage = compose(
  withT,
  withInNativeApp
)(({ t, me, url, inNativeApp, isIOS }) => {
  if (inNativeApp && isIOS) {
    return (
      <Fragment>
        {me && <Interaction.H1>{t('withMembership/ios/unauthorized/title')}</Interaction.H1>}
        {me && <Interaction.P>
          {t.elements('withMembership/ios/unauthorized/explanation', {
            webLink: (
              <a key='web' {...linkRule} href='/' target='_blank'>
                {t('withMembership/ios/unauthorized/explanation/webText')}
              </a>
            )
          })}
          <br />
        </Interaction.P>}
        <br />
        <Me />
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
              <Link key='pledge' route='pledge'>
                <a {...linkRule}>{t('withMembership/unauthorized/buyText')}</a>
              </Link>
            ),
            accountLink: (
              <Link key='account' route='account'>
                <a {...linkRule}>{t('withMembership/unauthorized/accountText')}</a>
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
      <Interaction.H1>{t('withMembership/title')}</Interaction.H1>
      <br />
      <SignIn />
      <Interaction.P>
        {t.elements('withMembership/signIn/note', {
          buyLink: (
            <Link route='pledge'>
              <a {...linkRule}>{t('withMembership/signIn/note/buyText')}</a>
            </Link>
          )
        })}
      </Interaction.P>
      <br />
      <Interaction.P>
        <Link route='index'>
          <a {...linkRule}>
            {t('withMembership/signIn/home')}
          </a>
        </Link>
      </Interaction.P>
    </Fragment>
  )
})

export const UnauthorizedPage = ({ me, url }) => (
  <Frame url={url} raw>
    <PageCenter>
      <UnauthorizedMessage me={me} />
    </PageCenter>
  </Frame>
)

export const WithoutMembership = withAuthorization(['member'])(({
  isAuthorized, render
}) => {
  if (!isAuthorized) {
    return render()
  }
  return null
})
export const WithMembership = withAuthorization(['member'])(({
  isAuthorized, render
}) => {
  if (isAuthorized) {
    return render()
  }
  return null
})

export const enforceMembership = WrappedComponent => withAuthorization(['member'])(({isAuthorized, me, ...props}) => {
  if (isAuthorized) {
    return <WrappedComponent {...props} />
  }
  return <UnauthorizedPage me={me} url={props.url} />
})

export default withAuthorization(['member'], 'isMember')
