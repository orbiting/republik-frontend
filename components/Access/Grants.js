import React from 'react'
import { compose, graphql } from 'react-apollo'

import { Interaction, Editorial } from '@project-r/styleguide'

import { MainContainer } from '../Frame'
import { timeFormat } from '../../lib/utils/format'
import Box from '../Frame/Box'
import query from '../Account/belongingsQuery'
import withInNativeApp from '../../lib/withInNativeApp'
import withT from '../../lib/withT'
import Link from 'next/link'

const { P } = Interaction

const dayFormat = timeFormat('%e. %B %Y')

const AccessGrants = ({ accessGrants, inNativeIOSApp, t }) => {
  const maxEndAt =
    accessGrants.length > 0 &&
    accessGrants.reduce(
      (acc, grant) =>
        new Date(grant.endAt) > acc ? new Date(grant.endAt) : acc,
      new Date()
    )

  return (
    accessGrants.length > 0 && (
      <Box>
        <MainContainer>
          <P>
            {t.elements('Account/Access/Grants/message/claimed', {
              maxEndAt: <span>{dayFormat(new Date(maxEndAt))}</span>
            })}
          </P>
          {!inNativeIOSApp && (
            <P>
              <Link href='/angebote' key='pledge' passHref>
                <Editorial.A>
                  {t('Account/Access/Grants/link/pledges')}
                </Editorial.A>
              </Link>
            </P>
          )}
        </MainContainer>
      </Box>
    )
  )
}

export default compose(
  graphql(query, {
    props: ({ data }) => ({
      accessGrants:
        (!data.loading && !data.error && data.me && data.me.accessGrants) || []
    })
  }),
  withT,
  withInNativeApp
)(AccessGrants)
