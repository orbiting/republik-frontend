import React, { Component } from 'react'
import { css, merge } from 'glamor'

import withT from '../../../lib/withT'

import {
  RawHtml,
  linkRule,
  fontFamilies
} from '@project-r/styleguide'

import List, { Item } from '../../List'

const styles = {
  a: merge(linkRule, {
    fontSize: 17,
    lineHeight: '25px',
    fontFamily: fontFamilies.sansSerifMedium
  }),
  p: css({
    margin: 0,
    fontSize: 17,
    lineHeight: '25px',
    fontFamily: fontFamilies.sansSerifRegular
  })
}

const A = ({children, ...props}) => <a {...props} {...styles.a}>{children}</a>
const P = ({children, ...props}) => <p {...props} {...styles.p}>{children}</p>

class MembershipGiver extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    const {memberships, t, isGivePackage} = this.props
    const {showGiveable, showGiven} = this.state

    const giveable = memberships.filter(m => m.voucherCode)
    const given = memberships.filter(m => m.claimerName)

    const hasGiveable = !!giveable.length
    const hasGiven = !!given.length

    if (!hasGiven && !hasGiveable) {
      return null
    }

    return (
      <div>
        {!isGivePackage && hasGiveable && (
          <A href='#' onClick={(e) => {
            e.preventDefault()
            this.setState(() => ({showGiveable: !showGiveable}))
          }}>
            {t('memberships/giver/giveable/show')}<br />
          </A>
        )}
        {hasGiveable && (isGivePackage || showGiveable) && (
          <div style={{margin: '10px 0'}}>
            <RawHtml type={P} dangerouslySetInnerHTML={{
              __html: !isGivePackage
                ? t('memberships/give/description/before/notGive')
                : t.pluralize('memberships/give/description/before', {
                  count: giveable.length
                })
            }} />
            <List>
              {giveable.map((membership, i) => (
                <Item key={i}>
                  <code>{membership.voucherCode}</code>
                  {' '}({t('memberships/sequenceNumber/label', membership)})
                </Item>
              ))}
            </List>
            <RawHtml type={P} dangerouslySetInnerHTML={{
              __html: t('memberships/give/description/after')
            }} />
          </div>
        )}
        {hasGiven && (
          <A href='#' onClick={(e) => {
            e.preventDefault()
            this.setState(() => ({showGiven: !showGiven}))
          }}>
            {isGivePackage
              ? t.pluralize('memberships/giver/given', {
                count: given.length
              })
              : t('memberships/giver/given/notGive')
            }
          </A>
        )}
        {hasGiven && showGiven && (
          <div style={{margin: '10px 0'}}>
            <RawHtml type={P} dangerouslySetInnerHTML={{
              __html: t('memberships/giver/description')
            }} />
            <List>
              {given.map((membership, i) => (
                <Item key={i}>
                  {membership.claimerName}
                  {' '}({t('memberships/sequenceNumber/label', membership)})
                </Item>
              ))}
            </List>
          </div>
        )}
      </div>
    )
  }
}

export default withT(MembershipGiver)
