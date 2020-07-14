import React, { useState, useEffect } from 'react'
import { compose, graphql } from 'react-apollo'
import { possibleAuthorSubscriptions } from './enhancers'
import {
  plainButtonRule,
  A,
  Interaction,
  mediaQueries,
  linkRule,
  colors
} from '@project-r/styleguide'
import { css } from 'glamor'
import SubscribeCheckbox from './SubscribeCheckbox'
import withT from '../../lib/withT'
import Loader from '../Loader'
import { Link } from '../../lib/routes'

const styles = {
  checkboxes: css({
    margin: '20px 0'
  }),
  authorContainer: css({
    display: 'flex',
    flexDirection: 'column',
    [mediaQueries.mUp]: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }),
  author: css({
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10
  }),
  userLink: css({
    color: colors.text,
    textDecoration: 'underline',
    '&:visited': {
      color: colors.text
    }
  }),
  checkbox: css({
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 16,
    ' div': {
      marginRight: 16
    },
    [mediaQueries.mUp]: {
      ' div': {
        marginLeft: 16
      }
    }
  })
}

const SubscribedAuthors = ({ t, data: { authors, loading, error } }) => {
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
            <Interaction.P style={{ marginBottom: 10 }}>
              {t.pluralize('Notifications/settings/authors/summary', {
                count: totalSubs
              })}
            </Interaction.P>
            <div style={{ margin: '20px 0' }}>
              {(showAll ? authors : visibleAuthors).map(author => (
                <div {...styles.authorContainer} key={author.user.id}>
                  <div {...styles.author}>
                    <Link route='profile' params={{ slug: author.user.slug }}>
                      <a {...linkRule} {...styles.userLink}>
                        {author.name}
                      </a>
                    </Link>
                  </div>
                  <div {...styles.checkbox}>
                    {['Document', 'Comment'].map(filter => (
                      <SubscribeCheckbox
                        key={author.user.subscribedByMe.object.id}
                        subscription={author.user.subscribedByMe}
                        filters={author.user.subscribedByMe.filters}
                        filterName={filter}
                        callout
                      />
                    ))}
                  </div>
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
  graphql(possibleAuthorSubscriptions)
)(SubscribedAuthors)
