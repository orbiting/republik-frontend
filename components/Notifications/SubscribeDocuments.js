import React from 'react'
import { compose, graphql } from 'react-apollo'
import { sectionSubscriptions } from './enhancers'
import { mediaQueries } from '@project-r/styleguide'
import Loader from '../Loader'
import { css } from 'glamor'
import SubscribeDocumentCheckbox from './SubscribeDocumentCheckbox'

const styles = {
  checkboxes: css({
    margin: '20px 0'
  }),
  checkbox: css({
    display: 'inline-block',
    width: '100%',
    [mediaQueries.mUp]: {
      width: '50%'
    }
  })
}

const getFormats = sections =>
  sections.nodes.reduce((acc, section) => acc.concat(section.formats.nodes), [])

const FormatCheckboxes = ({ formats }) => (
  <div {...styles.checkboxes}>
    {formats.map((format, i) => (
      <SubscribeDocumentCheckbox
        subscription={format.subscribedByMe}
        format={format}
        key={i}
      />
    ))}
  </div>
)

const SubscribeDocuments = ({ data: { error, loading, sections } }) => {
  return (
    <Loader
      error={error}
      loading={loading}
      render={() => {
        if (!sections) return null
        const formats = getFormats(sections)
        console.log(formats)
        return <FormatCheckboxes formats={formats} />
      }}
    />
  )
}

export default compose(graphql(sectionSubscriptions))(SubscribeDocuments)
