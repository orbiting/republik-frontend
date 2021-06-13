import React from 'react'
import { css } from 'glamor'

import TrialForm from '../Trial/Form'
import withT from '../../lib/withT'
import { useColorContext, Center } from '@project-r/styleguide'

import BrowserOnly from './BrowserOnly'

const styles = {
  container: css({
    padding: 13
  })
}

const InlineWrapper = ({ inline, children }) => {
  if (inline) {
    return <Center>{children}</Center>
  } else {
    return children
  }
}

const TrialPayNoteMini = ({ inline, t }) => {
  const [colorScheme] = useColorContext()

  return (
    <div
      {...colorScheme.set('backgroundColor', 'default')}
      {...styles.container}
    >
      <InlineWrapper inline={inline}>
        <BrowserOnly
          Component={TrialForm}
          componentProps={{
            minimal: true,
            showTitleBlock: true,
            onSuccess: () => {
              return false
            }
          }}
          height={115}
        />
      </InlineWrapper>
    </div>
  )
}

export default withT(TrialPayNoteMini)
