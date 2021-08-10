import { ElementConfigI } from '../custom-types'
import React, { Attributes, ReactElement, useState } from 'react'
import { css } from 'glamor'
import {
  Button,
  mediaQueries,
  fontFamilies,
  colors
  // @ts-ignore
} from '@project-r/styleguide'
import { MdCheckCircle } from '@react-icons/all-files/md/MdCheckCircle'

const HEIGHT = 64
const BAR_HEIGHT = 32
const CIRCLE_SIZE = 22

const styles = {
  content: css({
    height: 80,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }),
  mobileBorder: css({
    [mediaQueries.onlyS]: {
      margin: '0px 10px'
    }
  }),
  buttons: css({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly'
  }),
  bars: css({
    display: 'flex',
    width: '100%',
    height: HEIGHT
  }),
  left: css({
    width: '50%',
    borderLeftColor: 'rgba(0,0,0,0.17)',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderRightColor: 'rgba(0,0,0,0.17)',
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    position: 'relative'
  }),
  right: css({
    width: '50%',
    borderRightColor: 'rgba(0,0,0,0.17)',
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    position: 'relative'
  }),
  bar: css({
    position: 'absolute',
    top: (HEIGHT - BAR_HEIGHT) / 2,
    height: BAR_HEIGHT,
    whiteSpace: 'nowrap'
  }),
  barLabel: css({
    fontFamily: fontFamilies.sansSerifRegular,
    height: BAR_HEIGHT,
    lineHeight: `${BAR_HEIGHT}px`,
    whiteSpace: 'nowrap',
    padding: '0px 4px'
  }),
  labels: css({
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: fontFamilies.sansSerifRegular,
    fontWeight: 'normal',
    fontSize: 12,
    color: '#979797'
  }),
  label: css({
    whiteSpace: 'nowrap',
    marginBottom: 1
  }),
  userAnswerIcon: css({
    marginBottom: 4
  })
}

const OPTIONS = [
  {
    value: 'ja',
    label: 'Ja'
  },
  {
    value: 'nein',
    label: 'Nein'
  }
]

const AnswersChart: React.FC<{ answer: string }> = ({ answer }) => {
  const userTrue = answer === 'true'
  const userFalse = answer === 'false'
  const truePercent = 59
  const falsePercent = 41

  return (
    <div style={{ width: '100%' }} contentEditable={false}>
      <div {...styles.labels} style={{ justifyContent: 'space-around' }}>
        <label>2161 Stimmen</label>
      </div>
      <div {...styles.bars}>
        <div {...styles.left}>
          <div
            {...styles.bar}
            style={{
              right: 0,
              width: `${truePercent}%`,
              backgroundColor: 'rgb(75,151,201)',
              direction: 'rtl',
              textAlign: 'left'
            }}
          >
            <span style={{ marginLeft: userTrue ? -CIRCLE_SIZE : 0 }}>
              <label {...styles.barLabel}>Ja {truePercent}%</label>
              {userTrue && (
                <MdCheckCircle
                  {...styles.userAnswerIcon}
                  size={CIRCLE_SIZE}
                  color={colors.primary}
                />
              )}
            </span>
          </div>
        </div>
        <div {...styles.right}>
          <div
            {...styles.bar}
            style={{
              left: 0,
              width: `${falsePercent}%`,
              backgroundColor: '#ff7f0e',
              textAlign: 'right'
            }}
          >
            <span style={{ marginRight: userFalse ? -CIRCLE_SIZE : 0 }}>
              <label {...styles.barLabel}>Nein {falsePercent}%</label>
              {userFalse && (
                <MdCheckCircle
                  {...styles.userAnswerIcon}
                  size={CIRCLE_SIZE}
                  color={colors.primary}
                />
              )}
            </span>
          </div>
        </div>
      </div>
      <div {...styles.labels}>
        <label {...styles.label}>100%</label>
        <label {...styles.label}>0%</label>
        <label {...styles.label}>100%</label>
      </div>
    </div>
  )
}

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
}> = ({ attributes, children }) => {
  const [answer, setAnswer] = useState<string>('')
  return (
    <div {...attributes} {...styles.content} contentEditable={false}>
      {answer ? (
        <div {...styles.mobileBorder}>
          <AnswersChart answer={answer} />
        </div>
      ) : (
        <div {...styles.buttons}>
          {OPTIONS.map(option => (
            <div key={option.value}>
              <Button onClick={() => setAnswer(option.value)}>
                {option.label}
              </Button>
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  )
}

export const config: ElementConfigI = {
  Component
}
