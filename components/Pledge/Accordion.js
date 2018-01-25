import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ascending } from 'd3-array'
import {css, merge} from 'glamor'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

import {
  colors,
  linkRule,
  fontFamilies,
  Loader
} from '@project-r/styleguide'

export const OFFER_SORT = {
  ABO: 1,
  MONTHLY_ABO: 2,
  BENEFACTOR: 3,
  ABO_GIVE: 4,
  DONATE: 5
}

const styles = {
  title: css({
    fontFamily: fontFamilies.sansSerifRegular,
    fontSize: 19,
    lineHeight: '28px',
    marginBottom: 15
  }),
  packageHeader: css({
  }),
  package: css({
    display: 'block',
    textDecoration: 'none',
    color: '#000',
    marginTop: -1,
    fontFamily: fontFamilies.sansSerifRegular,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottom: `1px solid ${colors.divider}`,
    borderTop: `1px solid ${colors.divider}`
  }),
  packageHighlighted: css({
    position: 'relative',
    zIndex: 1,
    marginBottom: -1,
    marginLeft: -10,
    marginRight: -10,
    paddingLeft: 10,
    paddingRight: 10,
    width: 'calc(100% + 20px)',
    backgroundColor: colors.primaryBg,
    borderBottom: 'none',
    paddingBottom: 16,
    borderTop: 'none',
    paddingTop: 11
  }),
  packageTitle: css({
    fontFamily: fontFamilies.sansSerifMedium,
    fontSize: 20,
    lineHeight: '26px'
  }),
  packagePrice: css({
    marginTop: 0,
    color: colors.primary,
    lineHeight: '26px',
    fontSize: 20
  }),
  packageContent: css({
    fontSize: 17,
    lineHeight: '25px'
  }),
  buffer: css({
    // catch negative margin from last package
    marginTop: -1,
    marginBottom: 20
  }),
  links: css({
    lineHeight: '22px'
  })
}

const query = gql`
query pledgeAccordion($crowdfundingName: String!) {
  crowdfunding(name: $crowdfundingName) {
    id
    name
    packages {
      id
      name
      options {
        id
        price
        userPrice
        minAmount
        maxAmount
        defaultAmount
        reward {
          ... on MembershipType {
            id
            name
          }
          ... on Goodie {
            id
            name
          }
        }
      }
    }
  }
}
`

class Accordion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeIndex: undefined,
      selectedIndex: undefined
    }
  }
  render () {
    const {loading, error} = this.props
    if (loading || error) {
      return <Loader loading={loading} error={error} style={{minHeight: 400}} />
    }

    const {
      activeIndex
    } = this.state

    const {
      t,
      crowdfunding: {packages},
      crowdfundingName,
      children,
      extended
    } = this.props

    const links = [
      {
        route: 'pledge',
        params: {package: 'ABO', userPrice: 1},
        text: t('package/ABO/userPrice/teaser')
      }
    ]

    return (
      <div style={{marginTop: 20}}>
        {
          [...packages]
            .sort((a, b) => ascending(OFFER_SORT[a.name], OFFER_SORT[b.name]))
            .map((pkg, i) => {
              const isActive = activeIndex === i

              const price = pkg.options.reduce(
              (amount, option) => amount + option.price * option.minAmount,
              0
            )

              const packageStyle = merge(
              styles.package,
              isActive && styles.packageHighlighted
            )

              return (
                <Link key={i} route='pledge' params={{
                  package: pkg.name
                }}>
                  <a {...packageStyle}
                    onMouseOver={() => this.setState({
                      activeIndex: i
                    })}
                    onMouseOut={() => this.setState({
                      activeIndex: undefined
                    })}>
                    <div {...styles.packageHeader}>
                      <div {...styles.packageTitle}>
                        {t.first(
                          [
                            `package/${crowdfundingName}/${pkg.name}/title`,
                            `package/${pkg.name}/title`
                          ]
                      )}
                      </div>
                      {!!price && (<div {...styles.packagePrice}>
                        {t.first([
                          `package/${pkg.name}/price`,
                          'package/price'
                        ], {
                          formattedCHF: `CHF ${price / 100}`
                        })}
                      </div>)}
                    </div>
                    <div {...styles.packageContent}
                      style={{
                        display: (isActive || extended) ? 'block' : 'none'
                      }}>
                      <p>
                        {t.first(
                          [
                            `package/${crowdfundingName}/${pkg.name}/description`,
                            `package/${pkg.name}/description/short`
                          ]
                      )}
                      </p>
                      <span {...linkRule}>{t('package/choose')}</span>
                    </div>
                  </a>
                </Link>
              )
            })
        }
        <div {...styles.buffer} />
        {children}
        <div {...styles.links}>
          {
            links.map((link, i) => (
              <Link key={i} route={link.route} params={link.params}>
                <a {...linkRule}>
                  {link.text}<br />
                </a>
              </Link>
            ))
          }
        </div>
      </div>
    )
  }
}

Accordion.propTypes = {
  t: PropTypes.func.isRequired
}

const AccordionWithQuery = graphql(query, {
  props: ({ data }) => {
    return {
      loading: data.loading,
      error: data.error,
      crowdfunding: data.crowdfunding
    }
  }
})(Accordion)

export default withT(AccordionWithQuery)
