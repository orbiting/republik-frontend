import React, { Fragment} from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import {
  Label,
  Container,
  P,
  RawHtml,
  colors,
  mediaQueries,
  fontFamilies,
  Interaction
} from '@project-r/styleguide'

import { countFormat } from '../../lib/utils/format'
import { prefixHover } from '../../lib/utils/hover'
import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

import { ListWithQuery } from '../Testimonial/List'

import { buttonStyles } from './styles'

const GET_MEMBERSTATS = gql`
query members {
  memberStats {
    count
  }
}
`

const styles = {
  headline: css({
    fontSize: '28px',
    lineHeight: '34px',
    maxWidth: '1002px',
    textAlign: 'center',
    margin: '0 auto',
    fontWeight: 'normal',
    fontFamily: fontFamilies.serifTitle,
    marginTop: '12px',
    [mediaQueries.mUp]: {
      fontSize: '64px',
      lineHeight: '72px',
      marginTop: '50px'
    }

  }),
  lead: css({
    fontSize: '16px',
    lineHeight: '26px',
    textAlign: 'center',
    maxWidth: '702px',
    margin: '12px auto 0 auto',
    [mediaQueries.mUp]: {
      fontSize: '23px',
      lineHeight: '36px',
      marginTop: '32px'
    }
  }),
  actions: css({
    maxWidth: '974px',
    margin: '14px auto 0 auto',
    '& > *': {
      marginBottom: '9px',
      width: '100%'
    },
    [mediaQueries.mUp]: {
      marginTop: '80px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      '& > *': {
        margin: 0,
        width: '50%'
      },
      '& > *:first-child': {
        marginRight: '10px'
      },
      '& > *:last-child': {
        marginLeft: '10px'
      }
    }
  }),
  signInLabel: css({
    display: 'block',
    color: colors.text,
    '& a': {
      cursor: 'pointer',
      color: colors.text,
      textDecoration: 'underline'
    },
    [`'& ${prefixHover()}`]: {
      color: colors.secondary
    },
    '& a:focus': {
      color: colors.secondary
    },
    '& a:active': {
      color: colors.primary
    },
    fontSize: '12px',
    lineHeight: '18px',
    [mediaQueries.mUp]: {
      marginTop: '4px',
      fontSize: '16px',
      lineHeight: '24px'
    }
  }),
  communityWidget: css({
    margin: '9px auto 0 auto',
    maxWidth: '974px',
    [mediaQueries.mUp]: {
      margin: '78px auto 0 auto'
    }
  }),
  spacer: css({
    minHeight: '23px',
    [mediaQueries.mUp]: {
      minHeight: '84px'
    }
  }),
  communityHeadline: css({
    textAlign: 'center',
    fontSize: '16px',
    lineHeight: '25px',
    [mediaQueries.mUp]: {
      fontSize: '26px',
      lineHeight: '36px'
    },
    [mediaQueries.lUp]: {
      fontSize: '30px',
      lineHeight: '36px'
    }
  }),
  communityLink: css({
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '16px',
    lineHeight: '25px',
    [mediaQueries.mUp]: {
      marginTop: '16px',
      fontSize: '20px',
      lineHeight: '28px'
    },
    [mediaQueries.lUp]: {
      marginTop: '20px',
      fontSize: '23px',
      lineHeight: '28px'
    },
    '& a': {
      color: colors.text,
      textDecoration: 'underline'
    },
    [`'& ${prefixHover()}`]: {
      color: colors.secondary
    },
    '& a:focus': {
      color: colors.secondary
    },
    '& a:active': {
      color: colors.primary
    }
  })
}

const MarketingPage = ({ me, t, crowdfundingName, data: { memberStats }, ...props }) => {
  return (
    <Fragment>
      <Container>
        <h1 {...styles.headline}>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('marketing-20/title')
            }}
          />
        </h1>
        <P {...styles.lead}>{t('marketing-20/lead')}</P>
        <div {...styles.actions}>
          <div>
            <Link route='pledge'>
              <button {...buttonStyles.primary}>
                {t('marketing-20/join/button/label')}
              </button>
            </Link>
            <Label {...styles.signInLabel}>{
              t.elements(
                'marketing-20/signin',
                { link: <Link key='link' route={'signin'}>
                  <a>{t('marketing-20/signin/link') }</a>
                </Link>
                }
              )
            }</Label>
          </div>
          <Link route='preview'>
            <button {...buttonStyles.standard}>
              {t('marketing-20/preview/button/label')}
            </button>
          </Link>
        </div>
        <div {...styles.communityWidget}>
          <Interaction.H2 {...styles.communityHeadline}>
            {t(
              'marketing-20/community/title',
              { count: countFormat(memberStats.count) }
            )}
          </Interaction.H2>
          <ListWithQuery singleRow first={6} />
          <Interaction.P {...styles.communityLink}>
            <Link route='community'>
              <a>{t('marketing-20/community/link')}</a>
            </Link>
          </Interaction.P>
        </div>
        <div {...styles.spacer} />
      </Container>
    </Fragment>
  )
}

export default compose(
  withT,
  graphql(GET_MEMBERSTATS)
)(MarketingPage)
