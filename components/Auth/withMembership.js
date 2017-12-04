import React, { Fragment } from 'react'
import Frame from '../Frame'
import withT from '../../lib/withT'
import SignIn from './SignIn'
import Me from './Me'
import { Link } from '../../lib/routes'

import { Interaction, linkRule } from '@project-r/styleguide'

import { EnsureAuthorization, PageCenter } from './withAuthorization'

const UnauthorizedPage = withT(({t, me, roles = []}) => (
  <Frame raw>
    <PageCenter>
      {!me ? (
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
      ) : (
        <Fragment>
          <Interaction.H1>{t('withMembership/title')}</Interaction.H1>
          <Interaction.P>
            {t.elements('withMembership/unauthorized', {
              buyLink: (
                <Link route='pledge'>
                  <a {...linkRule}>{t('withMembership/unauthorized/buyText')}</a>
                </Link>
              ),
              accountLink: (
                <Link route='account'>
                  <a {...linkRule}>{t('withMembership/unauthorized/accountText')}</a>
                </Link>
              )
            })}
            <br />
          </Interaction.P>
          <br />
          <Me />
        </Fragment>
      )}
    </PageCenter>
  </Frame>
))

export const WithoutMembership = ({render}) => (
  <EnsureAuthorization
    roles={['member']}
    unauthorized={render} />
)
export const WithMembership = ({render}) => (
  <EnsureAuthorization
    roles={['member']}
    render={render} />
)

export default WrappedComponent => props => (
  <EnsureAuthorization
    roles={['member']}
    render={() => <WrappedComponent {...props} />}
    unauthorized={({me}) => <UnauthorizedPage me={me} />} />
)
