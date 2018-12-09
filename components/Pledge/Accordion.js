import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css, merge } from 'glamor'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ChevronRightIcon from 'react-icons/lib/md/chevron-right'

import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

import {
  colors,
  fontFamilies,
  Loader,
  mediaQueries,
  Editorial
} from '@project-r/styleguide'

const styles = {
  title: css({
    fontFamily: fontFamilies.sansSerifRegular,
    fontSize: 19,
    lineHeight: '28px',
    marginBottom: 15
  }),
  packageHeader: css({
    position: 'relative'
  }),
  package: css({
    display: 'block',
    textDecoration: 'none',
    color: '#000',
    marginTop: -1,
    fontFamily: fontFamilies.sansSerifRegular,
    paddingTop: 7,
    paddingBottom: 9,
    [mediaQueries.mUp]: {
      paddingTop: 15,
      paddingBottom: 21
    },
    borderBottom: `1px solid ${colors.divider}`,
    borderTop: `1px solid ${colors.divider}`
  }),
  packageHighlighted: css({
    position: 'relative',
    zIndex: 1,
    // marginTop: -1,
    marginBottom: -1,
    marginLeft: -10,
    marginRight: -10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 10,
    [mediaQueries.mUp]: {
      paddingTop: 16,
      paddingBottom: 22
    },
    width: 'calc(100% + 20px)',
    backgroundColor: colors.primaryBg,
    borderBottom: 'none',
    borderTop: 'none'
  }),
  packageTitle: css({
    fontFamily: fontFamilies.sansSerifMedium,
    fontSize: 16,
    lineHeight: '24px',
    [mediaQueries.mUp]: {
      fontSize: 22,
      lineHeight: '30px'
    }
  }),
  packagePrice: css({
    marginTop: 0,
    color: colors.primary,
    fontSize: 16,
    lineHeight: '24px',
    [mediaQueries.mUp]: {
      fontSize: 22,
      lineHeight: '30px'
    }
  }),
  packageIcon: css({
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: '-10px'
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
    lineHeight: '24px',
    marginTop: 13,
    fontSize: 16
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
    const { loading, error } = this.props
    if (loading || error) {
      return <Loader loading={loading} error={error} style={{ minHeight: 400 }} />
    }

    const {
      activeIndex
    } = this.state

    const {
      t,
      packages,
      pkgsFilter,
      crowdfundingName,
      children
    } = this.props

    const links = []

    if (pkgsFilter) {
      links.push({
        route: 'pledge',
        text: t('package/pkgsFilter/showAll')
      })
    }

    if (links.length < 1) {
      links.push({
        route: 'pledge',
        params: { package: 'ABO', userPrice: 1 },
        text: t('package/ABO/userPrice/teaser')
      })
    }

    return (
      <div style={{ marginTop: 20 }}>
        {
          [...packages]
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
                  package: pkg.name,
                  packages: pkgsFilter && pkgsFilter.join(',')
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
                      <span {...styles.packageIcon}>
                        <ChevronRightIcon size={24} />
                      </span>
                    </div>
                  </a>
                </Link>
              )
            })
        }
        { !pkgsFilter &&
          <Link route='claim'>
            <a
              {...merge(
                styles.package,
                activeIndex === packages.length && styles.packageHighlighted
              )}
              onMouseOver={() => this.setState({
                activeIndex: packages.length
              })}
              onMouseOut={() => this.setState({
                activeIndex: undefined
              })}
            >
              <div {...styles.packageHeader}>
                <div {...styles.packageTitle}>
                  {t('marketing/offers/claim')}
                </div>
                <span {...styles.packageIcon}>
                  <ChevronRightIcon size={24} />
                </span>
              </div>
            </a>
          </Link>
        }
        <div {...styles.buffer} />
        {children}
        <div {...styles.links}>
          {
            links.map((link, i) => (
              <Link key={i} route={link.route} params={link.params} passHref>
                <Editorial.A>
                  {link.text}<br />
                </Editorial.A>
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
  skip: props => !!props.packages,
  props: ({ data }) => {
    return {
      loading: data.loading,
      error: data.error,
      packages: data.crowdfunding && data.crowdfunding.packages
    }
  }
})(Accordion)

export default withT(AccordionWithQuery)
