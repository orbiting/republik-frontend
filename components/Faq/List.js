import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { css, merge } from 'glamor'

import Loader from '../Loader'
import Meta from '../Frame/Meta'
import withT from '../../lib/withT'

import {
  Interaction, RawHtml, colors,
  fontFamilies, mediaQueries
} from '@project-r/styleguide'

import {
  HEADER_HEIGHT, HEADER_HEIGHT_MOBILE
} from '../constants'

import {
  PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL
} from '../../lib/constants'

import { nest } from 'd3-collection'

const { P } = Interaction

const styles = {
  category: css({
    marginBottom: 40
  }),
  title: css({
    marginBottom: 20
  }),
  faq: css({
    padding: '10px 0',
    borderBottom: `1px solid ${colors.divider}`
  }),
  faqAnchor: css({
    display: 'block',
    visibility: 'hidden',
    position: 'relative',
    top: -(HEADER_HEIGHT_MOBILE + 5),
    [mediaQueries.mUp]: {
      top: -(HEADER_HEIGHT + 5)
    }
  }),
  question: css({
    cursor: 'pointer',
    '& a': {
      color: 'inherit',
      textDecoration: 'none'
    }
  }),
  answer: css({
    paddingBottom: 10,
    margin: '20px 0 40px 0'
  }),
  active: css({
    fontFamily: fontFamilies.sansSerifMedium,
    marginBottom: 10
  })
}

export const H2 = ({ children }) => (
  <Interaction.H2 {...styles.title}>{children}</Interaction.H2>
)

const AnswerP = (args) => (
  <P {...args} {...styles.answer} />
)

const slug = string => string
  .toLowerCase()
  .replace(/[^0-9a-zäöü]+/g, ' ')
  .trim()
  .replace(/\s+/g, '-')

class FaqList extends Component {
  constructor (...args) {
    super(...args)

    this.state = {}
  }
  componentDidMount () {
    if (window.location.hash) {
      this.setState(() => ({
        [window.location.hash.replace(/^#/, '')]: true
      }))
    }
  }
  render () {
    const { data: { loading, error, faqs }, t } = this.props
    return (
      <Loader loading={loading} error={error} render={() => {
        const faqsByCategory = nest()
          .key(d => d.category)
          .entries(faqs)

        return (
          <div>
            <Meta data={{
              pageTitle: t('faq/pageTitle'),
              title: t('faq/title'),
              description: t('faq/metaDescription'),
              url: `${PUBLIC_BASE_URL}/faq`,
              image: `${CDN_FRONTEND_BASE_URL}/static/social-media/faq.png`
            }} />
            <H2>{t('faq/before/title')}</H2>
            <Interaction.H3>{t('faq/before/support/title')}</Interaction.H3>
            <RawHtml type={P} dangerouslySetInnerHTML={{
              __html: t('faq/before/support/text')
            }} />
            <br />
            {faqsByCategory.map(({ key: title, values }) => (
              <div {...styles.category} key={title}>
                <H2>{title}</H2>
                {values.map((faq, i) => {
                  const active = this.state[slug(faq.question)]
                  return (
                    <div key={i} {...styles.faq}>
                      <a {...styles.faqAnchor} id={slug(faq.question)} />
                      <P {...merge(styles.question, active && styles.active)}>
                        <a href={`#${slug(faq.question)}`}
                          onClick={e => {
                            e.preventDefault()
                            this.setState(() => ({
                              [slug(faq.question)]: !active
                            }))
                          }}>
                          {faq.question}
                        </a>
                      </P>
                      {active && (
                        <RawHtml
                          type={AnswerP}
                          key={`answer${i}`}
                          dangerouslySetInnerHTML={{
                            __html: faq.answer.split('\n').join('<br />')
                          }} />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )
      }} />
    )
  }
}

const publishedFaqs = gql`
query {
  faqs {
    category
    question
    answer
  }
}
`

export default compose(
  withT,
  graphql(publishedFaqs)
)(FaqList)
