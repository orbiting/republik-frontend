import React from 'react'
import { css } from 'glamor'
import {
  Interaction,
  fontStyles,
  fontFamilies,
  mediaQueries,
  RawHtml
} from '@project-r/styleguide'

const { H2, P, Headline } = Interaction

export const Section = ({children}) =>
  <section {...css({
    marginBottom: 40
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
    fontWeight: 'normal',
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
    { text.split('\n\n').map(c => <PMedium><RawHtml dangerouslySetInnerHTML={{__html: c}}/></PMedium>) }
  </div>


const PSmall = ({children, indent = true}) =>
  <P {...css({
    marginTop: 10,
    marginLeft: indent ? 20 : 0,
    marginBottom: 15,
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular18,
      lineHeight: 1.4
    }
  })}>
    {children}
  </P>

export const Small = ({text, indent = true}) =>
  <div>
    { text.split('\n\n').map(c => <PSmall indent={indent}><RawHtml dangerouslySetInnerHTML={{__html: c}}/></PSmall>) }
  </div>

export const TextMedium = ({children}) =>
  React.Children.map(children, c =>
    <P {...css({
      marginBottom: 15
    })}>
      {c.props.children}
    </P>
  )

export const TextSmall = ({text, indent = true}) =>
  React.Children.map(children, c =>
    <P {...css({
      marginTop: 10,
      marginLeft: indent ? 20 : 0,
      marginBottom: 15,
      ...fontStyles.sansSerifRegular16,
      [mediaQueries.mUp]: {
        ...fontStyles.sansSerifRegular18,
        lineHeight: 1.4
      }
    })}>
      {c.props.children}
    </P>
  )
