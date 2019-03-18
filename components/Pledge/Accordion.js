import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css, merge } from 'glamor'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ChevronRightIcon from 'react-icons/lib/md/chevron-right'
import { nest } from 'd3-collection'
import { ascending } from 'd3-array'

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
  groupTitle: css({
    marginTop: 40,
    marginBottom: 10,
    fontFamily: fontFamilies.sansSerifMedium,
    fontSize: 19,
    lineHeight: '28px',
    [mediaQueries.mUp]: {
      fontSize: 25,
      lineHeight: '33px'
    }
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
    marginTop: -1
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
      group
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

const PackageItem = ({ t, hover, setHover, crowdfundingName, name, title, price, onClick, href }) => (
  <a
    {...merge(
      styles.package,
      hover === name && styles.packageHighlighted
    )}
    onMouseOver={() => setHover(name)}
    onMouseOut={() => setHover(undefined)}
    onClick={onClick}
    href={href}>
    <div {...styles.packageHeader}>
      <div {...styles.packageTitle}>
        {title || t.first(
          [
            `package/${crowdfundingName}/${name}/title`,
            `package/${name}/title`
          ]
        )}
      </div>
      {!!price && (<div {...styles.packagePrice}>
        {t.first([
          `package/${name}/price`,
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
)

class Accordion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hover: undefined
    }
  }
  render () {
    const { loading, error } = this.props
    if (loading || error) {
      return <Loader loading={loading} error={error} style={{ minHeight: 400 }} />
    }

    const {
      hover
    } = this.state

    const {
      t,
      packages,
      group,
      crowdfundingName
    } = this.props

    const groups = nest()
      .key(d => d.group)
      .entries(packages)

    if (group) {
      groups.sort(({ key: a }, { key: b }) => (
        ascending(+(a !== group), +(b !== group)) ||
        ascending(
          groups.findIndex(d => d.key === a),
          groups.findIndex(d => d.key === b)
        )
      ))
    }

    return (
      <div style={{ marginTop: 20 }}>
        {
          groups.map(({ key: group, values: pkgs }) => {
            const links = [
              group === 'ME' && {
                route: 'pledge',
                params: { package: 'ABO', userPrice: 1 },
                text: t('package/ABO/userPrice/teaser')
              }
            ].filter(Boolean)

            const setHover = hover => this.setState({ hover })

            return <Fragment>
              <div {...styles.groupTitle}>{t(`package/group/${group}`)}</div>
              {pkgs.map((pkg, i) => {
                const price = pkg.options.reduce(
                  (amount, option) => amount + option.price * option.minAmount,
                  0
                )

                return (
                  <Link key={pkg.name} route='pledge' params={{ package: pkg.name }} passHref>
                    <PackageItem
                      t={t}
                      hover={hover}
                      setHover={setHover}
                      name={pkg.name}
                      crowdfundingName={crowdfundingName}
                      price={price} />
                  </Link>
                )
              })}
              { group === 'ME' &&
                <Link route='claim' passHref>
                  <PackageItem
                    t={t}
                    hover={hover}
                    setHover={setHover}
                    title={t('marketing/offers/claim')}
                    name='claim'
                    crowdfundingName={crowdfundingName} />
                </Link>
              }
              <div {...styles.buffer} />
              { !!links.length && <div {...styles.links}>
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
              }
            </Fragment>
          })
        }
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
