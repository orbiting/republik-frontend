import React, { Fragment } from 'react'
import { css } from 'glamor'

import { MdDone } from 'react-icons/md'

import { Button, Loader, mediaQueries, colors } from '@project-r/styleguide'

import withT from '../../lib/withT'

export const SECTION_SPACE = 30
export const SECTION_SPACE_MOBILE = 20

const styles = {
  p: css({
    marginBottom: 20
  }),
  section: css({
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderTop: `1px solid ${colors.divider}`,
    paddingTop: SECTION_SPACE_MOBILE * 0.6,
    paddingBottom: SECTION_SPACE_MOBILE * 0.6,
    [mediaQueries.mUp]: {
      paddingTop: SECTION_SPACE * 0.6,
      paddingBottom: SECTION_SPACE * 0.6
    },
    '&:last-child': css({
      borderBottom: `1px solid ${colors.divider}`
    })
  }),
  heading: css({
    fontSize: SECTION_SPACE_MOBILE,
    [mediaQueries.mUp]: {
      fontSize: SECTION_SPACE
    }
  }),
  content: css({
    marginBottom: 20,
    /* paddingLeft: 0,
    [mediaQueries.mUp]: {
      paddingLeft: 55
    } */
    '&:last-child': css({
      paddingBottom: SECTION_SPACE_MOBILE * 0.6,
      [mediaQueries.mUp]: {
        paddingBottom: SECTION_SPACE * 0.6
      },
      borderBottom: `1px solid ${colors.divider}`
    })
  }),
  contentFooter: css({
    marginTop: 20
  }),
  doneIcon: css({
    height: SECTION_SPACE_MOBILE * 1.1,
    width: SECTION_SPACE_MOBILE * 1.1,
    alignSelf: 'flex-end',
    color: colors.primary,
    [mediaQueries.mUp]: {
      height: SECTION_SPACE * 1.1,
      width: SECTION_SPACE * 1.1
    }
  })
}

const Section = props => {
  const onExpand = e => {
    e.preventDefault()
    props.onExpand(props)
  }

  const onContinue = e => {
    e.preventDefault()
    props.onContinue(props)
  }

  const {
    heading,
    isLoading,
    isTicked,
    isVisited,
    isExpanded,
    error,
    children,
    forwardedRef,
    showContinue = true,
    t
  } = props

  return (
    <Fragment>
      <div ref={forwardedRef} {...styles.section} onClick={onExpand}>
        <div {...styles.heading}>{heading}</div>
        {(isTicked || isVisited) && <MdDone {...styles.doneIcon} />}
      </div>
      {isExpanded && (
        <div {...styles.content}>
          {(isLoading || error) && <Loader loading={isLoading} error={error} />}
          {!isLoading && !error && children}
          <div {...styles.contentFooter}>
            {showContinue && (
              <Button primary onClick={onContinue}>
                {t('Onboarding/Section/button/continue')}
              </Button>
            )}
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default withT(Section)
