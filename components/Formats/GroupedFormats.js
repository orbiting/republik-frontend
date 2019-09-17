import React, { Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import { ascending } from 'd3-array'
import { css } from 'glamor'
import { nest } from 'd3-collection'
import gql from 'graphql-tag'
import Link from '../Link/Href'
import withT from '../../lib/withT'

import {
  Loader,
  FormatTag,
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  h2: css({
    ...fontStyles.sansSerifRegular13,
    color: '#979797',
    margin: '0 0 15px 0',
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular16,
      margin: '12px 0 15px 0'
    }
  }),
  section: css({
    marginBottom: '25px',
    [mediaQueries.mUp]: {
      marginBottom: '30px',
      '& + &': {
        borderTop: `1px solid ${colors.divider}`
      }
    }
  }),
  link: css({
    color: 'inherit',
    textDecoration: 'none'
  })
}

const getFormats = gql`
  query getFormats {
    documents(first: 100, template: "format", feed: true) {
      nodes {
        meta {
          template
          kind
          title
          description
          path
          color
          publishDate
        }
        linkedDocuments {
          totalCount
        }
      }
    }
  }
`

const colorMap = {
  'editorial-#08809A': 'weekly',
  'editorial-#000000': 'opinion',
  'meta-#000000': 'meta',
  'scribble-#D44338': 'scribble',
  'editorial-#D44338': 'scribble',
  'meta-#3CAD00': 'social'
}

const sectionOrder = [
  'weekly',
  'opinion',
  'scribble',
  'meta',
  'social',
  'newsletter'
]

const getColorFromMeta = meta => {
  const formatMeta = meta.format && meta.format.meta
  const color = meta.color || (formatMeta && formatMeta.color)
  const kind = meta.kind || (formatMeta && formatMeta.kind)
  return color || colors[kind]
}

const GroupedFormats = ({ data: { loading, error, documents }, t }) => {
  const additionalLinks = [
    { href: '/veranstaltungen', label: t('formats/additionalLinks/events'), color: '#3CAD00', kind: 'meta' },
    { href: 'https://project-r.construction/news', label: t('formats/additionalLinks/project-r-newsletter'), color: '#000000', kind: 'meta' }
  ]

  return (
    <Loader
      loading={loading}
      error={error}
      render={() => {
        const links = documents.nodes
          .map(doc => {
            return {
              color: getColorFromMeta(doc.meta),
              label: doc.meta.title,
              href: doc.meta.path,
              kind: doc.meta.kind,
              count: doc.linkedDocuments.totalCount
            }
          })
          .concat(additionalLinks)

        const sections = nest()
          .key(d => {
            const key = d.label.match(/newsletter/i)
              ? 'newsletter'
              : d.kind
            return colorMap[`${key}-${d.color}`] || key || ''
          })
          .sortKeys((a, b) => ascending(sectionOrder.indexOf(a), sectionOrder.indexOf(b)))
          .sortValues((a, b) => ascending(a.count === undefined, b.count === undefined) || ascending(a.label, b.label))
          .entries(links)
          .map(d => {
            d.label = t(`formats/title/${d.key}`, undefined, '')
            return d
          })
          .filter(d => d.values.length && d.label)

        return (
          <Fragment>
            {sections.map(({ key, label, values }) => (
              <section {...styles.section} key={key}>
                <h2 {...styles.h2}>
                  {label}
                </h2>
                {values.filter(value => value.count !== 0).map(link => (
                  <Link href={link.href} passHref key={link.href}>
                    <a {...styles.link} href={link.href}>
                      <FormatTag
                        color={link.color}
                        label={link.label}
                        count={link.count} />
                    </a>
                  </Link>
                ))}
              </section>
            ))}
          </Fragment>
        )
      }}
    />
  )
}

export default compose(withT, graphql(getFormats))(GroupedFormats)
