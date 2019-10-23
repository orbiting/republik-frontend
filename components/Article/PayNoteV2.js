import React from 'react'
import {
  Field,
  BrandMark,
  colors,
  Editorial,
  Center,
  mediaQueries
} from '@project-r/styleguide'
// import { MdArrowForward } from 'react-icons/lib/md'
import { css } from 'glamor'
import { randomElement } from '../../lib/utils/helpers'

const TRY_TO_BUY_RATIO = 0.8

const BG_COLORS = [
  '#ff7669',
  '#cfefd7',
  '#fdb26e',
  '#8ee6fd',
  '#f9eca1',
  '#6bd076'
]

const TRY_VARIATIONS = [
  'tryNote/191023-v1',
  'tryNote/191023-v2'
]

const BUY_VARIATIONS = [
  'payNote/190305-v1',
  'payNote/190305-v2',
  'payNote/190305-v3',
  'payNote/190305-v4',
  'payNote/190305-v5',
  'payNote/190305-v6',
  'payNote/190305-v7',
  'payNote/190305-v8',
  'payNote/190305-v9'
]

const getTryVariation = () => randomElement(TRY_VARIATIONS)

const getBuyVariation = () => randomElement(BUY_VARIATIONS)

export const getPayNoteVariation = (isMember, isActiveMember) => {
  if (isActiveMember) {
    return
  }
  return isMember || Math.random() > TRY_TO_BUY_RATIO ? getBuyVariation() : getTryVariation()
}

export const getPayNoteColor = () => randomElement(BG_COLORS)

const getPayNoteText = (t, variation, position, element) => {
  return t(`article/${variation}/${position}${element ? '/' + element : ''}`)
}

const PayNoteCta = ({ inNativeIOSApp }) => {
  return <Field black small label='Email' />
}

const PayNoteBox = ({ lead, body, cta, bgColor }) => {
  const styles = {
    box: css({
      backgroundColor: bgColor,
      padding: '0 10px',
      margin: '40px 0 -40px',
      borderTop: `1px solid ${colors.text}`,
      [mediaQueries.mUp]: {
        width: '67%'
      }
    }),
    brand: css({
      width: 40,
      display: 'inline-block',
      verticalAlign: 'top',
      marginTop: 10,
      background: '#ffffff',
      padding: 5
    }),
    lead: css({
      display: 'inline-block',
      width: 'calc(100% - 50px)',
      margin: '5px 0 10px 10px'
    }),
    body: css({
      margin: 0,
      paddingBottom: 10
    }),
    cta: css({
      maxWidth: 260
    })
  }

  return (<div {...styles.box}>
    <div {...styles.brand}>
      <BrandMark />
    </div>
    <Editorial.Format {...styles.lead}>{lead}</Editorial.Format>
    <Editorial.Note {...styles.body}>{body}</Editorial.Note>
    <div {...styles.cta}>{cta}</div>
  </div>)
}

const PayNoteBanner = ({ lead, body, cta, bgColor }) => {
  const styles = {
    banner: css({
      backgroundColor: bgColor
    }),
    brand: css({
      display: 'none',
      width: 40,
      float: 'left',
      verticalAlign: 'top',
      margin: '10px 0 0 -60px',
      [mediaQueries.mUp]: {
        display: 'initial'
      }
    }),
    body: css({
      margin: 0
    }),
    cta: css({
      maxWidth: 260
    })
  }

  return (<div {...styles.banner}>
    <Center>
      <div {...styles.brand}>
        <BrandMark />
      </div>
      <Editorial.Note {...styles.body}><b>{lead}</b> {body}</Editorial.Note>
      <div {...styles.cta}>{cta}</div>
    </Center>
  </div>)
}

const PayNoteContainer = ({ inNativeIOSApp, variation, position, t, bgColor }) => {
  const lead = getPayNoteText(t, variation, position, 'title')
  const body = getPayNoteText(t, variation, position)
  const cta = <PayNoteCta variation={variation} inNativeIOSApp={inNativeIOSApp} />
  const Component = position === 'after' ? PayNoteBanner : PayNoteBox

  return <Component lead={lead} body={body} cta={cta} bgColor={bgColor} />
}

export const PayNote = ({ variation, ...props }) => {
  return variation ? <PayNoteContainer variation={variation} {...props} /> : null
}
