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

const PayNoteLead = ({ isTrial, variation }) => {
  return 'Suchen Sie klaren und kühnen Journalismus mit Sorgfalt, Tiefe und Witz?'
}

const PayNoteBody = ({ isTrial, variation }) => {
  return 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment.'
}

const PayNoteCta = ({ isTrial, inNativeIOSApp }) => {
  return <Field black small label='Email' />
}

const PayNoteBox = ({ lead, body, cta }) => {
  const styles = {
    box: css({
      backgroundColor: '#ff7669',
      padding: '0 10px',
      margin: '40px 0 -40px',
      borderTop: `2px solid ${colors.text}`,
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

const PayNoteBanner = ({ lead, body, cta }) => {
  const styles = {
    banner: css({
      backgroundColor: '#ff7669'
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
      <div {...styles.cta}>
        {cta}
      </div>
    </Center>
  </div>)
}

const PayNote = ({ isTrial, inNativeIOSApp, variation, position }) => {
  const lead = <PayNoteLead isTrial={isTrial} variation={variation} />
  const body = <PayNoteBody isTrial={isTrial} variation={variation} />
  const cta = <PayNoteCta isTrial={isTrial} inNativeIOSApp={inNativeIOSApp} />
  const Component = position === 'bottom' ? PayNoteBanner : PayNoteBox

  return <Component lead={lead} body={body} cta={cta} />
}

export default ({ isActiveMember, ...props }) => {
  return isActiveMember ? null : <PayNote {...props} />
}
