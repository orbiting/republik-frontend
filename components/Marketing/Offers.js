import React, { Fragment } from 'react'
import { ascending } from 'd3-array'
import withT from '../../lib/withT'
import { Link } from '../../lib/routes'
import { css } from 'glamor'
import { colors, mediaQueries, Editorial, Loader } from '@project-r/styleguide'
import ChevronRightIcon from 'react-icons/lib/md/chevron-right'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { OFFER_SORT } from '../Pledge/Accordion'

const styles = {
  offer: css({
    margin: 0,
    padding: 0,
    '& > li': {
      borderTop: `1px solid ${colors.divider}`,
      display: 'block',
      padding: '10px 30px 10px 0',
      position: 'relative'
    },
    '& > li a': {
      color: colors.text,
      display: 'block',
      textDecoration: 'none',
      fontSize: '17px',
      lineHeight: '22px',
      [mediaQueries.mUp]: {
        fontSize: '20px',
        lineHeight: '24px'
      },
      verticalAlign: 'middle'
    }
  }),
  icon: css({
    marginTop: '-14px',
    position: 'absolute',
    right: '5px',
    top: '50%'
  }),
  footer: css({
    marginTop: '20px'
  })
}

const List = ({ t, data }) => {
  return (
    <Loader error={data.error} loading={data.loading} style={{minHeight: 200}} render={() => (
      <Fragment>
        <ul {...styles.offer}>
          {data.crowdfunding.packages
          .map(pkg => ({
            key: pkg.name,
            label: t(`package/${pkg.name}/title`),
            params: {package: pkg.name}
          }))
          .concat([
            {key: 'claim', label: t('marketing/offers/claim'), route: 'claim'}
          ])
          .sort((a, b) => ascending(OFFER_SORT[a.key], OFFER_SORT[b.key]))
          .map(({key, label, route = 'pledge', params}) => (
            <li key={key}>
              <Link route={route} params={params}>
                <a>
                  {label}{' '}
                  <span {...styles.icon}>
                    <ChevronRightIcon size={30} />
                  </span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <div {...styles.footer}>
          <Link route='pledge' params={{package: 'ABO', userPrice: 1}}>
            <Editorial.A>
              {t('package/ABO/userPrice/teaser')}
            </Editorial.A>
          </Link>
        </div>
      </Fragment>
    )} />
  )
}

const query = gql`
query marketingOffers($crowdfundingName: String!) {
  crowdfunding(name: $crowdfundingName) {
    id
    packages {
      id
      name
    }
  }
}
`

export default compose(
  withT,
  graphql(query)
)(List)
