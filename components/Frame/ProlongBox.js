import React, { Fragment } from 'react'
import { withRouter } from 'next/router'
import { compose } from 'react-apollo'
import { timeDay } from 'd3-time'

import {
  Editorial,
  Interaction,
  mediaQueries,
  Button,
  Center,
  useColorContext
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
  })
}

const SingleLine = ({ children }) => (
  <div {...styles.singleLine}>{children}</div>
)

const dayFormat = timeFormat('%d. %B %Y')

const ProlongBox = ({ t, prolongBeforeDate, router }) => {
  const [colorScheme] = useColorContext()

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
    const styleTextColor = colorScheme.set('color', 'text')

    const explanation = t.elements(
      `${baseKey}/explanation`,
      {
        cancelLink: (
          <Link key='cancelLink' route='cancel' passHref>
            <Editorial.A {...styleTextColor}>
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
      <div
        {...styles.box}
        {...styleTextColor}
        {...colorScheme.set('backgroundColor', 'alert')}
      >
        <Wrapper>
          <Title>
            {t.elements(baseKey, {
              link: (
                <TokenPackageLink
                  key='link'
                  params={{ package: 'PROLONG' }}
                  passHref
                >
                  <Editorial.A {...styleTextColor}>
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
            <Interaction.P style={{ marginTop: 10 }} {...styleTextColor}>
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
