import React from 'react'
import { css } from 'glamor'
import { WithoutMembership } from '../Auth/withMembership'
import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

import {
  Container,
  Interaction,
  linkRule,
  colors
} from '@project-r/styleguide'

const styles = {
  box: css({
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: colors.primaryBg
  })
}

const Box = ({children, style}) => (
  <WithoutMembership render={() => (
    <div {...styles.box} style={style}>
      <Container>
        {children}
      </Container>
    </div>
  )} />
)

export const Before = withT(({t}) => (
  <Box>
    <Interaction.P>
      {t.elements('article/payNote/before', {
        buyLink: (
          <Link route='pledge'>
            <a {...linkRule}>{t('article/payNote/before/buyText')}</a>
          </Link>
        )
      })}
    </Interaction.P>
  </Box>
))

export const After = withT(({t}) => (
  <Box>
    <Interaction.P>
      {t.elements('article/payNote/after', {
        buyLink: (
          <Link route='pledge'>
            <a {...linkRule}>{t('article/payNote/after/buyText')}</a>
          </Link>
        )
      })}
    </Interaction.P>
  </Box>
))
