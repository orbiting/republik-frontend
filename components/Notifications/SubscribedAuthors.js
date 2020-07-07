import React, { useState, useEffect } from 'react'
import { compose, graphql } from 'react-apollo'
import { possibleAuthorSubscriptions } from './enhancers'
import { plainButtonRule, A, Interaction } from '@project-r/styleguide'
import { css } from 'glamor'
import SubscribeCheckbox from './SubscribeCheckbox'
import withT from '../../lib/withT'
import { withMembership } from '../Auth/checkRoles'
import Box from '../Frame/Box'
import Loader from '../Loader'

const styles = {
  checkboxes: css({
    margin: '20px 0'
  })
}

const SubscribedAuthors = ({
  t,
  data: { authors, loading, error },
  isMember
}) => {
  if (!authors || !authors.length) return null
  const [showAll, setShowAll] = useState(false)

  const visibleAuthors =
    authors && authors.filter(author => author.user.subscribedByMe.active)

  const totalSubs =
    authors &&
    authors.filter(author => author.user.subscribedByMe.active).length
  return (
    <Loader
      loading={loading}
      error={error}
      render={() => {
        return (
          <>
            {!isMember && (
              <Box style={{ margin: '10px 0', padding: 15 }}>
                <Interaction.P>
                  {t('Notifications/settings/formats/noMembership')}
                </Interaction.P>
              </Box>
            )}
            <Interaction.P style={{ marginBottom: 10 }}>
              {t.pluralize('Notifications/settings/authors/summary', {
                count: totalSubs
              })}
            </Interaction.P>
            <div style={{ margin: '20px 0' }}>
              {(showAll ? authors : visibleAuthors).map(author => (
                <div key={author.user.id}>
                  <SubscribeCheckbox
                    subscription={author.user.subscribedByMe}
                  />
                </div>
              ))}
            </div>
            <button
              {...plainButtonRule}
              onClick={() => {
                setShowAll(!showAll)
              }}
            >
              <A>
                {t(
                  `Notifications/settings/formats/${showAll ? 'hide' : 'show'}`
                )}
              </A>
            </button>
          </>
        )
      }}
    />
  )
}

export default compose(
  withT,
  withMembership,
  graphql(possibleAuthorSubscriptions)
)(SubscribedAuthors)
