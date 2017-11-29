import React from 'react'
import Frame from '../Frame'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import SignIn from './SignIn'
import Me from './Me'
import { css } from 'glamor'

import { Interaction } from '@project-r/styleguide'

const styles = {
  center: css({
    width: '100%',
    maxWidth: '540px',
    margin: '20vh auto',
    padding: 20
  })
}

export default authorizedRoles => Component =>
  withT(
    withMe(props => {
      const { me, t } = props
      if (
        me &&
        (!authorizedRoles ||
          (me.roles &&
            me.roles.some(role => authorizedRoles.indexOf(role) !== -1)))
      ) {
        return <Component {...props} />
      }
      if (!me) {
        return (
          <Frame raw>
            <div {...styles.center}>
              <Interaction.H1>{t('withAuthorization/signin')}</Interaction.H1>
              <br />
              <SignIn />
            </div>
          </Frame>
        )
      }
      return (
        <Frame raw>
          <div {...styles.center}>
            <Interaction.H1>{t('withAuthorization/restricted')}</Interaction.H1>
            <Interaction.P>
              {t('withAuthorization/authorizedRoles', {
                roles: authorizedRoles.join(', ')
              })}
              <br />
            </Interaction.P>
            <br />
            <Me />
          </div>
        </Frame>
      )
    })
  )
