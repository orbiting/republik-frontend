import React from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'

import { WithMembership } from '../Auth/withMembership'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import Box from '../Frame/Box'

import {
  Button,
  Center,
  Interaction,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  actions: css({
    display: 'flex',
    alignItems: 'center'
  }),
  beforeContent: css({
    paddingRight: '25px',
    [mediaQueries.mUp]: {
      paddingRight: 0
    }
  }),
  button: css({
    marginRight: 10,
    marginBottom: 10,
    [mediaQueries.mUp]: {
      marginRight: 20
    }
  })
}

const ProgressPrompt = compose(
  withT,
  withMe
)(({ t, me, onConfirm, onReject }) => (
  <WithMembership render={() => {
    return (
      <Box>
        <Center>
          <Interaction.P>
            {t('article/progressprompt/question')}
          </Interaction.P>
          <br />
          <div {...styles.actions}>
            <div {...styles.button}>
              <Button onClick={onConfirm}>
                {t('article/progressprompt/button/confirm')}
              </Button>
            </div>
            <div {...styles.button}>
              <Button onClick={onReject}>
                {t('article/progressprompt/button/reject')}
              </Button>
            </div>
          </div>
        </Center>
      </Box>
    )
  }} />
))

export default ProgressPrompt
