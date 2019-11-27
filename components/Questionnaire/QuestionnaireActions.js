import React from 'react'

import { css } from 'glamor'
import { compose } from 'react-apollo'

import { Button, A, InlineSpinner } from '@project-r/styleguide'

import withT from '../../lib/withT'

const styles = {
  actions: css({
    textAlign: 'center',
    margin: '20px auto 20px auto'
  }),
  reset: css({
    textAlign: 'center',
    marginTop: 10
  })
}

export default compose(withT)(
  ({ t, onSubmit, onReset, updating, submitting, invalid }) => {
    return (
      <div {...styles}>
        <Button
          primary
          onClick={onSubmit}
          disabled={updating || submitting || invalid}
        >
          {updating || submitting ? (
            <InlineSpinner size={40} />
          ) : (
            t('questionnaire/submit')
          )}
        </Button>
        {!!onReset && (
          <div {...styles.reset}>
            {invalid ? (
              t('questionnaire/invalid')
            ) : (
              <A href='#' onClick={onReset}>
                {t('questionnaire/cancel')}
              </A>
            )}
          </div>
        )}
      </div>
    )
  }
)
