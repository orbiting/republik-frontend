import React from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'

import { WithMembership } from '../../Auth/withMembership'
import withT from '../../../lib/withT'
import { AnchorLink } from '../../Account/Anchors'
import PathLink from '../../Link/Path'
import { PROGRESS_EXPLAINER_PATH } from '../../../lib/constants'

import {
  Button,
  Center,
  Interaction,
  linkRule,
  mediaQueries,
  ColorContextProvider,
  useColorContext
} from '@project-r/styleguide'

const styles = {
  box: css({
    paddingTop: 10,
    paddingBottom: 10,
    position: 'relative',
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
      margin: '5px 15px 0 0',
      minWidth: '120px',
      [mediaQueries.mUp]: {
        flexGrow: 0,
        margin: '5px 15px 0 0',
        minWidth: '160px'
      }
    }
  }),
  pMargin: css({
    margin: '10px 0',
    [mediaQueries.mUp]: {
      margin: '20px 0'
    }
  })
}

const { H2, P, Emphasis } = Interaction

export const getFeatureDescription = t =>
  t.elements('article/progressprompt/description/feature', {
    link: PROGRESS_EXPLAINER_PATH ? (
      <PathLink path={PROGRESS_EXPLAINER_PATH} passHref key='link'>
        <a {...linkRule}>
          {t('article/progressprompt/description/feature/link')}
        </a>
      </PathLink>
    ) : null
  })

const ProgressPrompt = compose(withT)(
  ({ t, onSubmitConsent, onRevokeConsent }) => {
    const [colorScheme] = useColorContext()
    return (
      <WithMembership
        render={() => (
          <div {...styles.box} {...colorScheme.set('backgroundColor', 'alert')}>
            <Center>
              <H2>{t('article/progressprompt/headline')}</H2>
              <P {...styles.pMargin}>{getFeatureDescription(t)}</P>
              <P {...styles.pMargin}>
                <Emphasis>{t('article/progressprompt/question')}</Emphasis>
                <span {...styles.actions}>
                  <Button onClick={onSubmitConsent}>
                    {t('article/progressprompt/button/confirm')}
                  </Button>
                  <Button onClick={onRevokeConsent}>
                    {t('article/progressprompt/button/reject')}
                  </Button>
                </span>
              </P>
              <P>
                {t.elements('article/progressprompt/description/settings', {
                  link: (
                    <AnchorLink id='position' key='link'>
                      {t('article/progressprompt/description/settings/link')}
                    </AnchorLink>
                  )
                })}
              </P>
            </Center>
          </div>
        )}
      />
    )
  }
)

export default ProgressPrompt
