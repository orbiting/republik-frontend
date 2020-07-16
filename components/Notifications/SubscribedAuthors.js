import React, { useState, useEffect } from 'react'
import { compose, graphql } from 'react-apollo'
import { myUserSubscriptions } from './enhancers'
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

const SubscribedAuthors = ({
  t,
  data: { authors, myUserSubscriptions, loading, error }
}) => {
  const [showAll, setShowAll] = useState(false)
  return (
    <Loader
      loading={loading}
      error={error}
      render={() => {
        const subscribedPromotedAuthors = authors.map(
          author => author.user.subscribedByMe
        )
        const subscribedOtherAuthors = myUserSubscriptions.subscribedTo.nodes
        const allSusbcribedAuthors = subscribedPromotedAuthors.concat(
          subscribedOtherAuthors
        )
        const filteredAuthors = allSusbcribedAuthors.filter(
          (author, index, all) =>
            all.findIndex(e => e.id === author.id) === index
        )

        const visibleAuthors =
          filteredAuthors && filteredAuthors.filter(author => author.active)

        const totalSubs =
          filteredAuthors &&
          filteredAuthors.filter(author => author.active).length

        return (
          <>
            <Interaction.P style={{ marginBottom: 10 }}>
              {t.pluralize('Notifications/settings/authors/summary', {
                count: totalSubs
              })}
            </Interaction.P>
            <div style={{ margin: '20px 0' }}>
              {(showAll ? filteredAuthors : visibleAuthors).map(author => (
                <div {...styles.authorContainer} key={author.object.id}>
                  <div {...styles.author}>
                    <Link
                      route='profile'
                      params={{ slug: author.userDetails.slug }}
                    >
                      <a {...linkRule} {...styles.userLink}>
                        {author.object.name}
                      </a>
                    </Link>
                  </div>
                  <div {...styles.checkbox}>
                    {(author.userDetails.documents.totalCount ||
                    (author.active && author.filters.includes('Document'))
                      ? ['Document', 'Comment']
                      : ['Comment']
                    ).map(filter => (
                      <SubscribeCheckbox
                        key={`${author.object.id}-${filter}`}
                        subscription={author}
                        filterName={filter}
                        filterLabel
                        callout
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {filteredAuthors.length !== visibleAuthors.length && (
              <button
                {...plainButtonRule}
                onClick={() => {
                  setShowAll(!showAll)
                }}
              >
                <A>
                  {t(
                    `Notifications/settings/formats/${
                      showAll ? 'hide' : 'show'
                    }`
                  )}
                </A>
              </button>
            )}
          </>
        )
      }}
    />
  )
}

export default compose(withT, graphql(myUserSubscriptions))(SubscribedAuthors)
