import React from 'react'
import { css } from 'glamor'
import {
  Interaction,
  fontStyles,
  fontFamilies,
  mediaQueries
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
    fontFamily: fontFamilies.sansSerifMedium
  })}>
    {children}
  </strong>

export const TextMedium = ({children}) =>
  React.Children.map(children, c =>
    <P {...css({
      marginBottom: 15
    })}>
      {c.props.children}
    </P>
  )

export const TextSmall = ({children, indent = true}) =>
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
