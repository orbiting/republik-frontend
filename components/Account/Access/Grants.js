import { compose, graphql } from 'react-apollo'

import { Interaction, linkRule } from '@project-r/styleguide'

import { Link } from '../../../lib/routes'
import { MainContainer } from '../../Frame'
import { timeFormat } from '../../../lib/utils/format'
import Box from '../../Frame/Box'
import query from '../belongingsQuery'
import withInNativeApp from '../../../lib/withInNativeApp'
import withT from '../../../lib/withT'

const { P } = Interaction

const dayFormat = timeFormat('%e. %B %Y')

const AccessGrants = ({ accessGrants, inNativeIOSApp, t }) => {
  return accessGrants.length > 0 && (
    <Box>
      <MainContainer>
        <P>{t('Account/Access/Grants/explanation')}</P>
        {accessGrants.map((grant, i) => (
          <P key={i}>
            {t('Account/Access/Grants/grant', {
              grantee: grant.grantee.name || grant.grantee.email,
              endAt: dayFormat(new Date(grant.endAt))
            })}
          </P>
        ))}
        {!inNativeIOSApp &&
          <P>
            <Link route='pledge' key='pledge'>
              <a {...linkRule}>
                {t('Account/Access/Grants/link/pledges')}
              </a>
            </Link>
          </P>
        }
      </MainContainer>
    </Box>
  )
}

export default compose(
  graphql(query, {
    props: ({data}) => ({
      accessGrants: (
        (
          !data.loading &&
          !data.error &&
          data.me &&
          data.me.accessGrants
        ) || []
      )
    })
  }),
  withT,
  withInNativeApp
)(AccessGrants)
