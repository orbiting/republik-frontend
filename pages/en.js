import React, {Component} from 'react'
import {css} from 'glamor'
import Head from 'next/head'
import Router from 'next/router'

import Share from '../components/Share'
import PureFooter, {SPACE} from '../components/Frame/PureFooter'
import VideoPlayer from '../components/VideoPlayer'

import track from '../lib/piwik'

import {
  NarrowContainer,
  Logo, BrandMark as R,
  fontFamilies,
  mediaQueries,
  P as EP, H1 as EH1,
  A, Label, Interaction
} from '@project-r/styleguide'

import {
  PUBLIC_BASE_URL, STATIC_BASE_URL,
  PAYPAL_DONATE_LINK
} from '../lib/constants'

const {H2, P: IP} = Interaction

const enVideo = {
  hls: 'https://player.vimeo.com/external/215798102.m3u8?s=b3730f7f6332985771865f3b85c13aeae93223b1',
  mp4: 'https://player.vimeo.com/external/215798102.hd.mp4?s=bdc8421b7d1c2a04fcf9521655332e54c7c4c039&profile_id=175',
  subtitles: '/static/subtitles/main_en.vtt',
  poster: `${STATIC_BASE_URL}/static/video/main.jpg`
}

const pRule = css({
  fontFamily: fontFamilies.sansSerifRegular,
  fontSize: 18
})

const P = ({children, ...props}) => (
  <p {...props} {...pRule}>{children}</p>
)

const styles = {
  text: css({
    marginTop: SPACE / 2,
    marginBottom: SPACE,
    fontFamily: fontFamilies.serifRegular,
    fontSize: 18,
    lineHeight: '27px'
  }),
  highlight: css({
    fontFamily: fontFamilies.serifBold,
    fontSize: 24,
    lineHeight: '36px'
  }),
  strong: css({
    fontFamily: fontFamilies.serifBold
  }),
  logoContainer: css({
    textAlign: 'center',
    marginBottom: SPACE
  }),
  column: css({
    maxWidth: 500,
    margin: `${SPACE}px auto`,
    '& ::selection': {
      color: '#fff',
      backgroundColor: '#000'
    }
  }),
  nav: css({
    marginTop: SPACE,
    marginBottom: SPACE,
    [mediaQueries.mUp]: {
      marginTop: SPACE,
      marginBottom: SPACE * 2
    }
  }),
  mainNav: css({
    fontFamily: fontFamilies.sansSerifRegular,
    fontSize: 44,
    lineHeight: '60px'
  }),
  address: css({
    lineHeight: 1.6,
    fontStyle: 'normal'
  }),
  mBr: css({
    display: 'none',
    [mediaQueries.mUp]: {
      display: 'inline'
    }
  }),
  credits: css({
    marginBottom: SPACE * 2,
    marginTop: SPACE,
    maxWidth: 500,
    marginLeft: 'auto',
    marginRight: 'auto'
  })
}

const Highlight = ({children, ...props}) => <span {...props} {...styles.highlight}>{children}</span>
const Strong = ({children}) => <span {...styles.strong}>{children}</span>

class EnPage extends Component {
  componentDidMount () {
    const {url: {query, query: {st}}} = this.props
    if (st) {
      const url = {
        pathname: '/en',
        query: {
          m: st === 'Completed'
            ? 'thank-you'
            : 'welcome-back'
        }
      }
      track([
        'addEcommerceItem',
        'en-donation', // (required) SKU: Product unique identifier
        undefined, // (optional) Product name
        undefined, // (optional) Product category
        parseFloat(query.amt), // (recommended) Product price
        1 // (optional, default to 1) Product quantity
      ])
      track([
        'trackEcommerceOrder',
        query.tx, // (required) Unique Order ID
        parseFloat(query.amt), // (required) Order Revenue grand total (includes tax, shipping, and subtracted discount)
        undefined, // (optional) Order sub total (excludes shipping)
        undefined, // (optional) Tax amount
        undefined, // (optional) Shipping amount
        false // (optional) Discount offered (set to false for unspecified parameter)
      ])
      Router.replace(url, url, {shallow: true})
    }
  }
  render () {
    const {url} = this.props
    const meta = {
      title: 'We are Republik',
      description: '',
      image: `${STATIC_BASE_URL}/static/social-media/en.png`,
      url: `${PUBLIC_BASE_URL}${url.pathname}`
    }
    const share = {
      url: meta.url,
      emailSubject: 'Republik Manifesto',
      emailAttachUrl: false,
      emailBody: `

Manifesto for journalism by republik.ch:
${meta.url}
`
    }
    const message = url.query.m

    return (
      <NarrowContainer>
        <Head>
          <title>Manifesto — Republik</title>
          <meta name='description' content={meta.description} />
          <meta property='og:type' content='website' />
          <meta property='og:url' content={meta.url} />
          <meta property='og:title' content={meta.title} />
          <meta property='og:description' content={meta.description} />
          <meta property='og:image' content={meta.image} />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:site' content='@RepublikMagazin' />
          <meta name='twitter:creator' content='@RepublikMagazin' />
        </Head>
        <div {...styles.column}>
          {message === 'thank-you' && (
            <div>
              <EH1>Merci</EH1>
              <EP>
                Thank you for supporting us.
              </EP>
            </div>
          )}
          {message === 'welcome-back' && (
            <div>
              <EH1>Welcome Back</EH1>
              <EP>
                If you have any questions about the donation process please <A href='mailto:nadja.schnetzler@project-r.construction'>contact us</A>.
              </EP>
            </div>
          )}
          <EH1>We are Republik</EH1>
          <EP>
            We are reclaiming journalism as profession and are creating a new business model for media companies that want to place their readers at the center. Our digital magazine Republik (in German) will launch in January 2018. Republik will be reader owned and ad free.
          </EP>
          <EP>
            We are an open-source cooperative, and we share our knowledge, software and business insights with others who also want to create journalism projects that reinforce democracy.
          </EP>

          <EP style={{marginBottom: SPACE * 2}}>
            <A href='mailto:nadja.schnetzler@project-r.construction'>Get in touch with us!</A>
          </EP>

          <R />

          <div {...styles.text}>
            <Highlight>Without journalism, no democracy.</Highlight><br />
            And without democracy, freedom disappears. If journalism dies, it is the end of an <Strong>open society,</Strong> of <Strong>freedom of expression,</Strong> of the right to <Strong>choose between competing arguments. Freedom of the press</Strong> was a battle cry of the <Strong>liberal revolution</Strong> — and it is the first victim of every dictatorship. Journalism was born out of <Strong>the Enlightenment.</Strong> Its purpose is to <Strong>criticize the powers</Strong> that be. That is why journalism is more than just a business to be run by corporate executives. Journalism is <Strong>responsible only to the public</Strong> — for in a democracy it is the same as in all of life: making <Strong>sound decisions</Strong> depends on getting <Strong>sound information.</Strong> Good journalism sends out teams to <Strong>explore reality.</Strong> The mission of journalists is to bring back the <Strong>facts and context</Strong> that citizens in a democracy need — and to report them as they are, <Strong>independently,</Strong> conscientiously and <Strong>fearing no one</Strong> but boredom. Journalism seeks <Strong>clarity,</Strong> waging a constant battle <Strong>against the primordial fear of the new.</Strong> Good journalism needs <Strong>passion,</Strong> skill and commitment. And it needs a thoughtful, curious and <Strong>fearless public.</Strong>
            {' '}
            <Highlight style={{verticalAlign: 'top'}}>You!</Highlight>
          </div>
        </div>

        <div {...styles.logoContainer}>
          <Logo width={200} />
        </div>

        <div style={{textAlign: 'center', marginBottom: SPACE}}>
          <P>
            Share Manifesto
          </P>
          <P style={{marginBottom: SPACE / 2}}>
            <Share fill='#000' {...share} />
          </P>
          <P>
            <A href={`${STATIC_BASE_URL}/static/manifesto_en.pdf`}>
              Download PDF
            </A>
          </P>

          <div {...styles.credits}>
            <Label>
              Thank you for your support in translating the English manifesto:
              {' '}<br {...styles.mBr} />
              Simon Froehling, Anna Wendel, Hal Wyner, Rafaël Newman
            </Label>
          </div>
        </div>

        <div {...styles.column}>
          <H2>Video</H2>
          <IP>
            Our crowdfunding video with English subtitles tells you why it is time for a new model in journalism.
          </IP>
        </div>
        <VideoPlayer subtitles src={enVideo} />
        <div {...styles.column}>
          <IP style={{marginBottom: 40}}>
            If you read German, you might want to consider becoming a member of the cooperative behind Republik and read our magazine for a whole year from January 2018 on:
            {' '}
            <A href='/angebote'>Jetzt mitmachen</A>.
          </IP>

          <H2>Donate</H2>
          <IP style={{marginBottom: 10}}>
            Donate to support the independent journalism of the future.
          </IP>
          {!!PAYPAL_DONATE_LINK && <IP style={{margin: '10px 0'}}>
            <A href={PAYPAL_DONATE_LINK}>Donate with PayPal</A>
          </IP>}
          <Label>Banking Account</Label><br />
          <table style={{borderSpacing: '10px 5px', marginLeft: -10}}>
            <tbody>
              <tr>
                <td><Label>Name</Label></td>
                <td>Project R Genossenschaft</td>
              </tr>
              <tr>
                <td><Label>Street</Label></td>
                <td>Sihlhallenstrasse 1</td>
              </tr>
              <tr>
                <td><Label>City</Label></td>
                <td>8004 Zürich</td>
              </tr>
              <tr>
                <td><Label>Country</Label></td>
                <td>Switzerland</td>
              </tr>
              <tr>
                <td><Label>Bank</Label></td>
                <td>Raiffeisenbank Winterthur</td>
              </tr>
              <tr>
                <td><Label>IBAN</Label></td>
                <td>CH04 8148 5000 0083 4669 1</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{textAlign: 'center', marginBottom: SPACE}}>
          <PureFooter en url={url} />
        </div>
      </NarrowContainer>
    )
  }
}

export default EnPage
