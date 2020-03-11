import React from 'react'
import { compose, graphql } from 'react-apollo'
import {
  sectionSubscriptions,
  withSubToDoc,
  withUnsubFromDoc
} from './enhancers'
import { Checkbox, mediaQueries } from '@project-r/styleguide'
import Loader from '../Loader'
import { css } from 'glamor'

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

const FormatCheckbox = compose(
  withSubToDoc,
  withUnsubFromDoc
)(({ format, subToDoc, unsubFromDoc }) => {
  const toggleSubscribe = () => {
    if (!format.subscribedByMe) {
      subToDoc({ documentId: format.id })
    } else {
      unsubFromDoc({ subscriptionId: format.subscribedByMe.id })
    }
  }

  return (
    <div {...styles.checkbox}>
      <Checkbox checked={format.subscribedByMe} onChange={toggleSubscribe}>
        <span>{format.meta.title}</span>
      </Checkbox>
    </div>
  )
})

const FormatCheckboxes = ({ formats }) => (
  <div {...styles.checkboxes}>
    {formats.map((format, i) => (
      <FormatCheckbox format={format} key={i} />
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
        return <FormatCheckboxes formats={formats} />
      }}
    />
  )
}

export default compose(graphql(sectionSubscriptions))(SubscribeDocuments)
