import React, { Component } from 'react'
import { compose } from 'react-apollo'
import { nest } from 'd3-collection'
import { timeFormat } from '../../lib/utils/format'
import Link from '../Link/Href'
import withT from '../../lib/withT'
import ActionBar from '../ActionBar/FeedActionBar'
import StickySection from './StickySection'
import PropTypes from 'prop-types'
import formatCredits from './formatCredits'

import {
  TeaserFeed
} from '@project-r/styleguide'

const dateFormat = timeFormat('%A,\n%d.%m.%Y')

const groupByDate = nest().key(d => dateFormat(new Date(d.meta.publishDate)))

class Feed extends Component {
  render () {
    const { documents } = this.props
    const nodes = documents
      ? [...documents.nodes]
      : []

    return (
      <>
        {
          nodes &&
          groupByDate.entries(nodes).map(({ key, values }, i, all) =>
            <StickySection
              key={i}
              hasSpaceAfter={i < all.length - 1}
              label={key}
            >
              {
                values.map(doc =>
                  <TeaserFeed
                    {...doc.meta}
                    credits={formatCredits(doc.meta.credits)}
                    publishDate={undefined}
                    kind={
                      doc.meta.template === 'editorialNewsletter' ? (
                        'meta'
                      ) : (
                        doc.meta.kind
                      )
                    }
                    Link={Link}
                    key={doc.meta.path}
                    bar={<ActionBar
                      documentId={doc.id}
                      userListItems={doc.userListItems}
                      {...doc.meta}
                      meta={doc.meta} />}
                  />
                )
              }
            </StickySection>
          )
        }
      </>
    )
  }
}

Feed.propTypes = {
  documents: PropTypes.object.isRequired
}

export default compose(
  withT
)(Feed)
