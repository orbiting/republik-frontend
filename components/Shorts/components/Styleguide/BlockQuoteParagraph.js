import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import {
  mediaQueries,
  useColorContext,
  fontStyles,
  colors
} from '@project-r/styleguide'

export const fontRule = css({
  ...fontStyles.sansSerifRegular,
  '& em, & i': fontStyles.sansSerifItalic,
  '& strong, & b': fontStyles.sansSerifMedium,
  '& strong em, & em strong, & b i, & i b': {
    textDecoration: `underline wavy ${colors.error}`
  }
})

const styles = {
  quote: css({
    margin: 0,
    padding: '0 15px 12px 15px',
    fontSize: '15px',
    ...fontStyles.sansSerifRegular15,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular18,
      padding: '0 25px 20px 25px',
      '&:first-child': {
        paddingTop: '20px'
      }
    },
    '&:first-child': {
      paddingTop: '12px'
    }
  })
}

const BlockQuoteParagraph = ({ children, attributes }) => {
  const [colorScheme] = useColorContext()
  return (
    <p
      {...attributes}
      {...styles.quote}
      {...colorScheme.set('backgroundColor', 'hover')}
      {...fontRule}
    >
      {children}
    </p>
  )
}

BlockQuoteParagraph.propTypes = {
  children: PropTypes.node.isRequired,
  attributes: PropTypes.object
}

export default BlockQuoteParagraph
