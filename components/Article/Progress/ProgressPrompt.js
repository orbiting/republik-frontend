import React from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'

import { WithMembership } from '../../Auth/withMembership'
import withT from '../../../lib/withT'
import { AnchorLink } from '../../Account/Anchors'
import PathLink from '../../Link/Path'

import {
  Button,
  Center,
  Interaction,
  colors,
  linkRule,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  box: css({
    paddingTop: 10,
    paddingBottom: 10,
    position: 'relative',
    backgroundColor: colors.primaryBg,
    [mediaQueries.mUp]: {
      paddingTop: 30,
      paddingBottom: 30
    }
  }),
  actions: css({
    display: 'flex',
    flexWrap: 'wrap',
    position: 'relative',
    '& > button': {
      flexGrow: 1,
      margin: '0 15px 10px 0',
      minWidth: '120px',
      [mediaQueries.mUp]: {
        flexGrow: 0,
        margin: '0 15px 20px 0',
        minWidth: '160px'
      }
    }
  })
}

const { H2, P, Emphasis } = Interaction

// TODO: replace with stable redirect.
const META_ARTICLE_PATH = '/2019/02/14/duerfen-wir-mehr-ueber-ihr-verhalten-wissen'

export const getFeatureDescription = (t) => t.elements(
  'article/progressprompt/description/feature', {
    link: (
      <PathLink path={META_ARTICLE_PATH} passHref key='link'>
        <a {...linkRule}>
          {t('article/progressprompt/description/feature/link')}
        </a>
      </PathLink>
    )
  }
)

const ProgressPrompt = compose(
  withT
)(({ t, onSubmitConsent, onRevokeConsent }) => (
  <WithMembership render={() => {
    return (
      <div {...styles.box}>
        {/* TODO: Remove warning after internal testing. */}
        <div style={{ fontSize: 12, lineHeight: '14px', background: '#c00', color: '#fff', position: 'absolute', top: 0, right: 0, padding: '3px 10px 5px 10px', borderRadius: '0 0 0 5px' }}>
          <Interaction.Emphasis>+++ INTERNE TESTRUNDE – TRY IT OUT! +++</Interaction.Emphasis>
        </div>
        <Center>
          <H2>
            {t('article/progressprompt/headline')}
          </H2>
          <P withMargin>
            {getFeatureDescription(t)}
          </P>
          <P withMargin>
            <Emphasis>{t('article/progressprompt/question')}</Emphasis>
          </P>
          <div {...styles.actions}>
            <Button onClick={onSubmitConsent}>
              {t('article/progressprompt/button/confirm')}
            </Button>
            <Button onClick={onRevokeConsent}>
              {t('article/progressprompt/button/reject')}
            </Button>
          </div>
          <P>
            {t.elements('article/progressprompt/description/settings', {
              link: (
                <AnchorLink id='position' key='link'>
                  {t('article/progressprompt/description/settings/link')}
                </AnchorLink>
              ) })}
          </P>
        </Center>
      </div>
    )
  }} />
))

export default ProgressPrompt
