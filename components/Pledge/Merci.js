import React, { Component, Fragment } from 'react'
import { compose } from 'react-apollo'
import { format } from 'url'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import { Link } from '../../lib/routes'

import Poller from '../Auth/Poller'
import { withSignIn } from '../Auth/SignIn'
import { WithMembership } from '../Auth/withMembership'
import ErrorMessage from '../ErrorMessage'

import Account from '../Account'
import ActionBar from '../ActionBar'

import { Content, MainContainer } from '../Frame'

import ClaimPledge from './Claim'
import MerciText from './MerciText'

import { EMAIL_CONTACT, PUBLIC_BASE_URL } from '../../lib/constants'

import {
  linkRule,
  Interaction,
  RawHtml,
  InlineSpinner,
  Button
} from '@project-r/styleguide'

const {H1, P} = Interaction

export const gotoMerci = (query) => {
  // workaround for apollo cache issues
  // - can't manage to clear all query caches
  // - couldn't clear myAddress query,
  //   possibly because id-less address type
  window.location = format({
    pathname: '/konto',
    query
  })
  // TODO: Write update cache functions instead of reload navigation
  // Router.push({
  //   pathname: '/merci',
  //   query
  // }).then(() => {
  //   window.scrollTo(0, 0)
  // })
}

const parseSignInQuery = ({query, t}) => {
  if (query.signInError) {
    return {
      signInError: query.signInError
    }
  }
  let signInResponse
  try {
    signInResponse = JSON.parse(query.signInResponse)
  } catch (e) {
    return {
      signInError: t('merci/postpay/signInError/jsonParseError')
    }
  }
  return {
    signInResponse
  }
}

class Merci extends Component {
  constructor (props) {
    super(props)
    const { query } = this.props
    const signInQuery = parseSignInQuery(this.props)

    this.state = {
      polling: !!(query.email && signInQuery.signInResponse),
      email: query.email,
      ...signInQuery
    }
  }
  render () {
    const { me, t, query } = this.props
    const {
      polling, email,
      signInResponse, signInError, signInLoading
    } = this.state
    if (query.claim) {
      return (
        <MainContainer><Content>
          <ClaimPledge t={t} me={me} id={query.claim} />
        </Content></MainContainer>
      )
    }
    if (polling) {
      return (
        <MainContainer><Content>
          <P>
            {t('merci/postpay/lead')}
          </P>
          <Poller
            tokenType={signInResponse.tokenType}
            email={email}
            phrase={signInResponse.phrase}
            alternativeFirstFactors={signInResponse.alternativeFirstFactors}
            onSuccess={() => {
              this.setState({
                polling: false
              })
            }} />
          <P>
            {!!query.id && (
              <Link route='account' params={{claim: query.id}}>
                <a {...linkRule}><br /><br />{t('merci/postpay/reclaim')}</a>
              </Link>
            )}
          </P>
        </Content></MainContainer>
      )
    }
    if (signInError && email && query.id) {
      return (
        <MainContainer><Content>
          <H1>{t('merci/postpay/signInError/title')}</H1>
          <RawHtml type={P} dangerouslySetInnerHTML={{
            __html: t('merci/postpay/signInError/text', {
              email: query.email,
              mailto: `mailto:${EMAIL_CONTACT}?subject=${
                encodeURIComponent(
                  t('merci/postpay/signInError/email/subject')
                )}&body=${
                encodeURIComponent(
                  t(
                    'merci/postpay/signInError/email/body',
                    {
                      pledgeId: query.id,
                      email: email,
                      error: signInError
                    }
                  )
                )}`
            })
          }} />
          {!!signInError && <ErrorMessage error={signInError} />}
          <div style={{margin: '20px 0'}}>
            {signInLoading ? <InlineSpinner /> : <Button
              block
              disabled={signInLoading}
              onClick={() => {
                if (signInLoading) {
                  return
                }
                this.setState(() => ({
                  signInLoading: true
                }))
                this.props.signIn(email)
                  .then(({data}) => {
                    this.setState(() => ({
                      polling: true,
                      signInLoading: false,
                      signInResponse: data.signIn
                    }))
                  })
                  .catch(error => {
                    this.setState(() => ({
                      signInError: error,
                      signInLoading: false
                    }))
                  })
              }}>{t('merci/postpay/signInError/retry')}</Button>}
          </div>
          <Link route='account' params={{claim: query.id}}>
            <a {...linkRule}><br /><br />{t('merci/postpay/reclaim')}</a>
          </Link>
        </Content></MainContainer>
      )
    }
    if (!me) {
      return (
        <Account query={query} merci />
      )
    }

    const buttonStyle = {marginBottom: 10, marginRight: 10}

    return (
      <Fragment>
        <MainContainer><Content style={{paddingBottom: 0}}>
          <MerciText pledgeId={query.id} />
          <WithMembership render={() => (
            <div style={{marginTop: 10}}>
              <Link route='index'>
                <Button primary style={buttonStyle}>
                  {t('merci/action/read')}
                </Button>
              </Link>
              {!me.hasPublicProfile && (
                <Link route='profile' params={{slug: me.username || me.id}}>
                  <Button style={buttonStyle}>
                    {t('merci/action/profile')}
                  </Button>
                </Link>
              )}
            </div>
          )} />
          <P style={{marginBottom: 80}}>
            <ActionBar
              url={`${PUBLIC_BASE_URL}/`}
              tweet={t('merci/share/tweetTemplate')}
              emailSubject={t('merci/share/emailSubject')}
              emailBody={t('merci/share/emailBody', {
                url: `${PUBLIC_BASE_URL}/`,
                backerName: me.name
              })}
              emailAttachUrl={false} />
          </P>
        </Content></MainContainer>
        <Account query={query} merci />
      </Fragment>
    )
  }
}

export default compose(
  withMe,
  withT,
  withSignIn
)(Merci)
