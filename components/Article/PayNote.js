import React, { Fragment } from 'react'
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

const styles = {
  actions: css({
    display: 'flex',
    flexDirection: 'column',
    marginTop: 15,
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
  afterContainer: css({
    padding: '15px 0',
    backgroundColor: colors.secondaryBg,
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
  memberStats {
    count
  }
}
`

// The total number of paynote translation variations in lib/translations.json
export const NUM_VARIATIONS = 9

export const Before = compose(
  withT,
  graphql(query),
  withInNativeApp
)(({ t, data: { memberStats }, isSeries, inNativeIOSApp, index, expanded }) => (
  <WithoutMembership render={() => {
    const translationPrefix = !inNativeIOSApp && isSeries
      ? 'article/payNote/series'
      : `article/payNote/${index}`
    return (
      <BottomPanel expanded={expanded}>
        <div {...styles.beforeContent}>
          <p {...styles.beforeParagraph}>
            {t.elements(inNativeIOSApp ? 'article/payNote/before/ios' : `${translationPrefix}/before`, {
              count: <span style={{whiteSpace: 'nowrap'}} key='count'>{countFormat(
                (memberStats && memberStats.count) || 20000
              )}</span>
            })}
          </p>
        </div>
        {!inNativeIOSApp && (
          <div {...styles.actions}>
            <Link key='buy' route='pledge'>
              <Button primary style={multiLineButtonStyle}>
                {t(`${translationPrefix}/before/buy/button`)}
              </Button>
            </Link>
          </div>
        )}
      </BottomPanel>
    )
  }} />
))

export const After = compose(
  withT,
  withMe,
  graphql(query),
  withInNativeApp
)(({ t, me, data: { memberStats }, isSeries, inNativeIOSApp, index, bottomBarRef }) => (
  <WithoutMembership render={() => {
    const translationPrefix = !inNativeIOSApp && isSeries
      ? 'article/payNote/series'
      : `article/payNote/${index}`
    return (
      <div {...styles.afterContainer}>
        <Center>
          <Interaction.H3 style={{ marginBottom: 15 }}>
            {t(`${translationPrefix}/after/title`)}
          </Interaction.H3>
          <Interaction.P>
            {t.elements(inNativeIOSApp ? 'article/payNote/after/ios' : `${translationPrefix}/after`, {
              count: <span style={{whiteSpace: 'nowrap'}} key='count'>{countFormat(
                (memberStats && memberStats.count) || 20000
              )}</span>
            })}
          </Interaction.P>
          <br />
          <div {...styles.actions} ref={bottomBarRef}>
            {!inNativeIOSApp && (
              <Fragment>
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
              </Fragment>
            )}
          </div>
        </Center>
      </div>
    )
  }} />
))
