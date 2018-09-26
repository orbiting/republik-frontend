import React from 'react'
import { css } from 'glamor'
import { fontFamilies, fontStyles, Interaction, mediaQueries, RawHtml } from '@project-r/styleguide'

const { H2, P, Headline } = Interaction

export const Section = ({children}) =>
  <section {...css({
    marginTop: 30
  })}>
    {children}
  </section>

export const Title = ({children}) =>
  <Headline {...css({
    marginBottom: 35
  })}>
    {children}
  </Headline>

export const Heading = ({children}) =>
  <H2 {...css({
    marginBottom: 20
  })}>
    {children}
  </H2>

export const Strong = ({children}) =>
  <strong {...css({
    fontFamily: fontFamilies.sansSerifMedium,
    fontWeight: 'normal'
  })}>
    {children}
  </strong>

const PMedium = (props) =>
  <P {...css({
    marginBottom: 15
  })}>
    {props.children}
  </P>

export const Body = ({text}) =>
  <div>
    {
      text.split('\n\n')
        .map(c =>
          <PMedium>
            <RawHtml dangerouslySetInnerHTML={{__html: c}} />
          </PMedium>
        )
    }
  </div>

const PSmall = ({children, indent = true}) =>
  <P {...css({
    marginTop: 10,
    marginLeft: indent ? 20 : 0,
    marginBottom: 15,
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
  </P>

export const Small = ({text, indent = true}) =>
  <div>
    {
      text.split('\n\n')
        .map((c, i) =>
          <PSmall key={i} indent={indent}>
            <RawHtml dangerouslySetInnerHTML={{__html: c}} />
          </PSmall>
        )
    }
  </div>

export const Caption = ({children}) =>
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
