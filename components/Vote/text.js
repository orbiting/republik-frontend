import React from 'react'
import { css } from 'glamor'
import { colors, fontFamilies, fontStyles, Interaction, mediaQueries, RawHtml } from '@project-r/styleguide'
import withInNativeApp from '../../lib/withInNativeApp'

const { H2, Headline } = Interaction

export const Section = ({ children }) =>
  <section {...css({
    marginTop: 30
  })}>
    {children}
  </section>

export const Title = ({ children }) =>
  <Headline {...css({
    marginBottom: 35
  })}>
    {children}
  </Headline>

export const Heading = ({ children }) =>
  <H2 {...css({
    marginBottom: 20
  })}>
    {children}
  </H2>

export const Strong = ({ children }) =>
  <strong {...css({
    fontFamily: fontFamilies.sansSerifMedium,
    fontWeight: 'normal'
  })}>
    {children}
  </strong>

const PMedium = (props) =>
  <div {...css({
    color: colors.text,
    ...fontStyles.sansSerifRegular16,
    marginBottom: 15,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular21
    },
    '& strong': {
      fontFamily: fontFamilies.sansSerifMedium,
      fontWeight: 'normal'
    },
    '& ul': {
      paddingLeft: 20
    }
  })}>
    {props.children}
  </div>

export const Body = withInNativeApp(({ dangerousHTML, inNativeApp }) => {
  const html = inNativeApp
    ? dangerousHTML.replace(/'/g, '"').replace(/target="_blank"/g, '')
    : dangerousHTML
  return (
    <div>
      {
        html
          .split('\n\n')
          .map((c, i) =>
            <PMedium key={i}>
              <RawHtml dangerouslySetInnerHTML={{ __html: c }} />
            </PMedium>
          )
      }
    </div>
  )
})

const PSmall = ({ children, indent = true }) =>
  <div {...css({
    marginTop: 10,
    marginLeft: indent ? 20 : 0,
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular16,
      lineHeight: 1.4
    },
    '& strong': {
      fontFamily: fontFamilies.sansSerifMedium,
      fontWeight: 'normal'
    }
  })}>
    {children}
  </div>

export const Small = withInNativeApp(({ dangerousHTML, inNativeApp, indent = true }) => {
  const html = inNativeApp
    ? dangerousHTML.replace(/'/g, '"').replace(/target="_blank" /, '')
    : dangerousHTML
  return (
    <div>
      {
        html.split('\n\n')
          .map((c, i) =>
            <PSmall key={i} indent={indent}>
              <RawHtml dangerouslySetInnerHTML={{ __html: c }} />
            </PSmall>
          )
      }
    </div>
  )
})

export const Caption = ({ children }) =>
  <div {...css({
    margin: '5px auto 0 auto',
    width: '100%',
    ...fontStyles.sansSerifRegular12,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular15,
      lineHeight: '18px'
    }
  })}>
    {children}
  </div>
