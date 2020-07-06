import React, { Fragment } from 'react'
import { withRouter } from 'next/router'
import { compose } from 'react-apollo'
import { timeDay } from 'd3-time'

import {
  Editorial,
  Interaction,
  colors,
  mediaQueries,
  Button,
  Center
} from '@project-r/styleguide'

import { css } from 'glamor'

import TokenPackageLink from '../Link/TokenPackage'
import withInNativeApp from '../../lib/withInNativeApp'
import { Link } from '../../lib/routes'
import { timeFormat } from '../../lib/utils/format'

const styles = {
  box: css({
    padding: 15
  }),
  singleLine: css({
    textAlign: 'center',
    fontSize: 13,
    [mediaQueries.mUp]: {
      fontSize: 16
    }
  }),
  boxLight: css({
    backgroundColor: colors.primaryBg
  }),
  boxDark: css({
    backgroundColor: colors.negative.primaryBg,
    color: '#fff'
  })
}

const SingleLine = ({ children }) => (
  <div {...styles.singleLine}>{children}</div>
)

const dayFormat = timeFormat('%d. %B %Y')

const ProlongBox = ({ t, prolongBeforeDate, router, dark: inDarkFrame }) => {
  if (
    router.pathname === '/pledge' ||
    router.pathname === '/cancel' ||
    router.pathname === '/meta' ||
    router.pathname === '/cockpit'
  ) {
    return null
  }
  const date = new Date(prolongBeforeDate)
  const numberOfDays = timeDay.count(new Date(), date)
  if (numberOfDays <= 30) {
    const key =
      numberOfDays <= 2 ? (numberOfDays < 0 ? 'overdue' : 'due') : 'before'
    const baseKey = `prolongNecessary/${key}`

    const dark = inDarkFrame || key !== 'before'
    const colorStyle = { color: dark ? '#fff' : undefined }

    const explanation = t.elements(
      `${baseKey}/explanation`,
      {
        cancelLink: (
          <Link key='cancelLink' route='cancel' passHref>
            <Editorial.A style={colorStyle}>
              {t(`${baseKey}/explanation/cancelText`)}
            </Editorial.A>
          </Link>
        ),
        graceEndDate: dayFormat(timeDay.offset(date, 14))
      },
      ''
    )
    const hasExplanation = !!explanation.length
    const Title = hasExplanation ? Interaction.H2 : Fragment
    const Wrapper = hasExplanation ? Center : SingleLine

    const buttonText = t(`${baseKey}/button`, undefined, '')

    return (
      <div {...styles.box} {...styles[dark ? 'boxDark' : 'boxLight']}>
        <Wrapper>
          <Title style={colorStyle}>
            {t.elements(baseKey, {
              link: (
                <TokenPackageLink
                  key='link'
                  params={{ package: 'PROLONG' }}
                  passHref
                >
                  <Editorial.A style={colorStyle}>
                    {t(`${baseKey}/linkText`)}
                  </Editorial.A>
                </TokenPackageLink>
              )
            })}
          </Title>
          {buttonText && (
            <TokenPackageLink key='link' params={{ package: 'PROLONG' }}>
              <Button style={{ marginTop: 10 }} primary>
                {buttonText}
              </Button>
            </TokenPackageLink>
          )}
          {hasExplanation && (
            <Interaction.P style={{ ...colorStyle, marginTop: 10 }}>
              {explanation}
            </Interaction.P>
          )}
        </Wrapper>
      </div>
    )
  }
  return null
}

export default compose(withRouter, withInNativeApp)(ProlongBox)
