import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { css } from 'glamor'

import { WithoutMembership } from '../Auth/withMembership'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import { Link } from '../../lib/routes'
import { countFormat } from '../../lib/utils/format'
import withInNativeApp from '../../lib/withInNativeApp'
import BottomPanel from './BottomPanel'

import {
  Button,
  Center,
  Interaction,
  colors,
  fontStyles,
  linkRule,
  mediaQueries
} from '@project-r/styleguide'

import { negativeColors } from '../Frame/Footer'

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
  }),
  beforeParagraph: css({
    margin: 0,
    ...fontStyles.sansSerifRegular14,
    lineHeight: '20px',
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular21
    }
  }),
  secondaryContainer: css({
    padding: '15px 0',
    backgroundColor: colors.secondaryBg,
    [mediaQueries.mUp]: {
      padding: '30px 0'
    }
  }),
  blackContainer: css({
    backgroundColor: negativeColors.primaryBg,
    color: negativeColors.text,
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    padding: '15px 0',
    [mediaQueries.mUp]: {
      padding: '30px 0'
    }
  }),
  aside: css({
    marginTop: 15,
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular18,
      lineHeight: '22px',
      marginLeft: 30,
      marginTop: 0
    }
  })
}

const multiLineButtonStyle = {
  height: 'auto',
  minHeight: '60px'
}

const query = gql`
query payNoteMembershipStats {
  membershipStats {
    count
  }
}
`

const ACTIVE_VARIATIONS = [
  '180920-v1',
  '180920-v2',
  '180920-v3',
  '180920-v4',
  '180920-v5',
  '180920-v6',
  '180920-v7',
  '180920-v8',
  '180920-v9'
]

export const getRandomVariation = () => {
  const randomIndex = Math.floor(Math.random() * ACTIVE_VARIATIONS.length)
  return ACTIVE_VARIATIONS[randomIndex]
}

const CountSpan = ({ membershipStats }) => (
  <span style={{whiteSpace: 'nowrap'}}>{countFormat(
    (membershipStats && membershipStats.count) || 20000
  )}</span>
)

export const Before = compose(
  withT,
  graphql(query),
  withInNativeApp
)(({ t, data: { membershipStats }, inNativeIOSApp, variation, expanded }) => (
  <WithoutMembership render={() => {
    if (inNativeIOSApp) {
      return (
        <div {...styles.blackContainer}>
          <Center>
            <Interaction.P style={{color: 'inherit'}}>
              {t.elements('article/payNote/before/ios', {
                count: <CountSpan key='count' membershipStats={membershipStats} />
              })}
            </Interaction.P>
          </Center>
        </div>
      )
    }
    const translationPrefix = `article/payNote/${variation}`
    return (
      <BottomPanel expanded={expanded} button={(
        <Link route='pledge'>
          <Button primary style={multiLineButtonStyle}>
            {t(`${translationPrefix}/before/buy/button`)}
          </Button>
        </Link>
      )}>
        <div {...styles.beforeContent}>
          <p {...styles.beforeParagraph}>
            {t.elements(`${translationPrefix}/before`, {
              count: <CountSpan key='count' membershipStats={membershipStats} />
            })}
          </p>
        </div>
      </BottomPanel>
    )
  }} />
))

export const After = compose(
  withT,
  withMe,
  graphql(query),
  withInNativeApp
)(({ t, me, data: { membershipStats }, inNativeIOSApp, variation, bottomBarRef }) => (
  <WithoutMembership render={() => {
    const translationPrefix = `article/payNote/${variation}`
    return (
      <div {...styles.secondaryContainer}>
        <Center>
          {inNativeIOSApp ? (
            <div ref={bottomBarRef}>
              <Interaction.P>
                {t.elements('article/payNote/after/ios', {
                  count: <CountSpan key='count' membershipStats={membershipStats} />
                })}
              </Interaction.P>
            </div>
          ) : (
            <Fragment>
              <Interaction.H3 style={{ marginBottom: 15 }}>
                {t(`${translationPrefix}/after/title`)}
              </Interaction.H3>
              <Interaction.P>
                {t.elements(`${translationPrefix}/after`, {
                  count: <CountSpan key='count' membershipStats={membershipStats} />
                })}
              </Interaction.P>
              <br />
              <div {...styles.actions} ref={bottomBarRef}>
                <Link key='buy' route='pledge'>
                  <Button primary style={multiLineButtonStyle}>
                    {t(`${translationPrefix}/after/buy/button`)}
                  </Button>
                </Link>
                {!me && (
                  <div {...styles.aside}>
                    {t.elements('article/payNote/secondaryAction/text', {
                      link: (
                        <Link key='preview' route='preview'>
                          <a {...linkRule} style={{whiteSpace: 'nowrap'}}>
                            {t('article/payNote/secondaryAction/linkText')}
                          </a>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </Fragment>
          )}
        </Center>
      </div>
    )
  }} />
))

Before.propTypes = After.propTypes = {
  variation: PropTypes.oneOf(ACTIVE_VARIATIONS.concat('series')).isRequired
}
