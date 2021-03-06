import React from 'react'
import { css } from 'glamor'
import {
  colors,
  fontFamilies,
  fontStyles,
  Interaction,
  mediaQueries,
  RawHtml,
  A
} from '@project-r/styleguide'
import withInNativeApp from '../../lib/withInNativeApp'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

const { H2, Headline } = Interaction

export const Section = ({ children }) => (
  <section
    {...css({
      marginTop: 30
    })}
  >
    {children}
  </section>
)

export const Title = ({ children }) => (
  <Headline
    {...css({
      marginBottom: 35
    })}
  >
    {children}
  </Headline>
)

export const Heading = ({ id, children }) => (
  <H2
    id={`${id}`}
    {...css({
      marginTop: 100,
      marginBottom: 20
    })}
  >
    {children}
  </H2>
)

export const Strong = ({ children }) => (
  <strong
    {...css({
      fontFamily: fontFamilies.sansSerifMedium,
      fontWeight: 'normal'
    })}
  >
    {children}
  </strong>
)

const PMedium = props => (
  <div
    {...css({
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
        paddingLeft: 25
      }
    })}
  >
    {props.children}
  </div>
)

export const Body = withInNativeApp(({ dangerousHTML, inNativeApp }) => {
  const html = inNativeApp
    ? dangerousHTML.replace(/'/g, '"').replace(/target="_blank"/g, '')
    : dangerousHTML
  return (
    <div>
      {html.split('\n\n').map((c, i) => (
        <PMedium key={i}>
          <RawHtml dangerouslySetInnerHTML={{ __html: c }} />
        </PMedium>
      ))}
    </div>
  )
})

const PSmall = ({ children, indent = true }) => (
  <div
    {...css({
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
    })}
  >
    {children}
  </div>
)

export const Small = withInNativeApp(
  ({ dangerousHTML, inNativeApp, indent = true }) => {
    const html = inNativeApp
      ? dangerousHTML.replace(/'/g, '"').replace(/target="_blank"/g, '')
      : dangerousHTML
    return (
      <div>
        {html.split('\n\n').map((c, i) => (
          <PSmall key={i} indent={indent}>
            <RawHtml dangerouslySetInnerHTML={{ __html: c }} />
          </PSmall>
        ))}
      </div>
    )
  }
)

const PTiny = ({ children, note }) => (
  <div
    {...css({
      marginTop: 10,
      ...fontStyles.sansSerifRegular14,
      [mediaQueries.mUp]: {
        ...fontStyles.sansSerifRegular14,
        lineHeight: 1.4
      },
      '& strong': {
        fontFamily: fontFamilies.sansSerifMedium,
        fontWeight: 'normal'
      },
      color: note ? colors.lightText : undefined
    })}
  >
    {children}
  </div>
)

export const Tiny = withInNativeApp(
  ({ dangerousHTML, inNativeApp, note = false }) => {
    const html = inNativeApp
      ? dangerousHTML.replace(/'/g, '"').replace(/target="_blank"/g, '')
      : dangerousHTML
    return (
      <div>
        {html.split('\n\n').map((c, i) => (
          <PTiny key={i} note={note}>
            <RawHtml dangerouslySetInnerHTML={{ __html: c }} />
          </PTiny>
        ))}
      </div>
    )
  }
)

export const Caption = ({ children }) => (
  <div
    {...css({
      margin: '5px auto 0 auto',
      width: '100%',
      ...fontStyles.sansSerifRegular12,
      [mediaQueries.mUp]: {
        ...fontStyles.sansSerifRegular15,
        lineHeight: '18px'
      }
    })}
  >
    {children}
  </div>
)

const styles = {
  list: css({
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular21
    }
  }),
  anchor: css({
    display: 'block',
    position: 'relative',
    visibility: 'hidden',
    top: -HEADER_HEIGHT_MOBILE,
    [mediaQueries.lUp]: {
      top: -HEADER_HEIGHT
    }
  })
}

export const mdComponents = {
  h1: Title,
  h2: ({ children }) => (
    <div>
      <a
        {...styles.anchor}
        id={React.Children.toArray(children)
          .join('')
          .split(' ')[0]
          .replace(/ä/, 'a')
          .replace(/ö/, 'o')
          .replace(/ü/, 'u')
          .toLowerCase()}
      />
      <Heading>{children}</Heading>
    </div>
  ),
  a: A,
  p: PMedium,
  small: PSmall,
  strong: ({ children }) => (
    <span style={{ fontFamily: fontFamilies.sansSerifMedium }}>{children}</span>
  ),
  ul: ({ children }) => <ul {...styles.list}>{children}</ul>,
  ol: ({ children }) => <ol {...styles.list}>{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  img: props => <img {...props} style={{ width: '100%' }} />
}
