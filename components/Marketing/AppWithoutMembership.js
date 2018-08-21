import React from 'react'
import { compose } from 'react-apollo'
import { Link } from '../../lib/routes'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import { css } from 'glamor'

import {
  Container,
  Editorial,
  linkRule,
  mediaQueries
} from '@project-r/styleguide'

const MAX_WIDTH = '1005px'

// TODO: revisit special font sizes with design.
const styles = {
  container: css({
    paddingBottom: 60,
    [mediaQueries.mUp]: {
      paddingBottom: 120
    }
  }),
  noMember: css({
    textAlign: 'center',
    padding: '18px 0',
    [mediaQueries.mUp]: {
      padding: '30px 0'
    }
  })
}

const AppIndex = ({ me, t, crowdfundingName, data }) => (
  <div {...styles.container}>
    {me && (
      <div {...styles.noMember}>
        <Container style={{ maxWidth: MAX_WIDTH }}>
          <Editorial.P>
            {t.elements('marketing/noActiveMembership', {
              link: (
                <Link route='account' key='account'>
                  <a {...linkRule}>{t('marketing/noActiveMembership/link')}</a>
                </Link>
              )
            })}
          </Editorial.P>
        </Container>
      </div>
    )}
  </div>
)

export default compose(
  withMe,
  withT
)(AppIndex)
