import React from 'react'
import { css } from 'glamor'

import withT from '../../lib/withT'
import { Interaction, useColorContext } from '@project-r/styleguide'

const { P } = Interaction

const styles = {
  container: css({
    display: 'inline-block',
    position: 'relative',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }),
  count: css({
    fontFeatureSettings: '"tnum" 1, "kern" 1',
    position: 'absolute',
    right: 0
  })
}

export const NoResultsItem = ({ title }) => {
  const [colorScheme] = useColorContext()
  return <P><span {...colorScheme.set('color', 'disabled')}>{title}</span></P>
}

const DefaultWrapper = ({ children, ...props }) => (
  <span {...props}>{children}</span>
)

const ArticleItem = ({ title, selected, count, Wrapper = DefaultWrapper }) => {
  const [colorScheme] = useColorContext()
  return (
    <Wrapper
      {...styles.container}
      style={{
        paddingRight: count ? 10 + String(count).length * 12 : 0
      }}
    >
      <span {...(selected && colorScheme.set('color', 'text'))}>{title}</span>
      {count && (
        <span {...styles.count} {...colorScheme.set('color', 'primary')}>
          {count}
        </span>
      )}
    </Wrapper>
  )
}

export default withT(ArticleItem)
