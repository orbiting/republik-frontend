import React, { Fragment } from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'

import { WithMembership } from '../Auth/withMembership'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'
import Box from '../Frame/Box'

import {
  Button,
  Container,
  Interaction,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  actions: css({
    display: 'flex',
    flexDirection: 'column',
    [mediaQueries.mUp]: {
      alignItems: 'center',
      flexDirection: 'row'
    }
  }),
  beforeContent: css({
    paddingRight: '25px',
    [mediaQueries.mUp]: {
      paddingRight: 0
    }
  })
}

const ProgressNote = compose(
  withT,
  withMe,
  withInNativeApp
)(({ t, me, inNativeIOSApp, onClick }) => (
  <WithMembership render={() => {
    return (
      <Fragment>
        {inNativeIOSApp ? (
          <div>
              App
          </div>
        ) : (
          <Box>
            <Container>
              <Interaction.P>
                Wollen Sie bei der letzten Position weiterlesen?
              </Interaction.P>
              <br />
              <div {...styles.actions}>
                <Button onClick={onClick}>
                  Ja
                </Button>
              </div>
            </Container>
          </Box>
        )}
      </Fragment>
    )
  }} />
))

export default ProgressNote
