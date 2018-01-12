import React from 'react'
import PropTypes from 'prop-types'
import { RawHtml } from '@project-r/styleguide'

const RawHtmlElements = ({ t, translationKey, replacements, missingValue }) =>
  t.elements(translationKey, replacements, missingValue).map(
    (element, i) =>
      typeof element === 'string' ? (
        <RawHtml
          key={`html${i}`}
          dangerouslySetInnerHTML={{
            __html: element
          }}
        />
      ) : (
        element
      )
  )

RawHtmlElements.propTypes = {
  t: PropTypes.func.isRequired,
  translationKey: PropTypes.string.isRequired,
  replacements: PropTypes.object,
  missingValue: PropTypes.string
}

export default RawHtmlElements
