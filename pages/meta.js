import React, { Component, Fragment } from 'react'
import { shuffle } from 'd3-array'
import { compose } from 'react-apollo'

import { postMessage } from '../lib/withInNativeApp'
import { Link } from '../lib/routes'

import Front from '../components/Front'
import Status from '../components/CrowdfundingStatus'
import List, { Highlight } from '../components/List'
import VideoCover from '../components/VideoCover'

import {
  Interaction,
  Center,
  Gallery,
  Figure,
  FigureImage,
  FigureCaption,
  FigureByline,
  Button,
  A
} from '@project-r/styleguide'
import QuestionnaireMetaWidget from '../components/Questionnaire/QuestionnaireMetaWidget'
import { data as gallery } from '../lib/meta/gallery.json'
import withT from '../lib/withT'
import withMe from '../lib/apollo/withMe'
import TokenPackageLink from '../components/Link/TokenPackage'

import {
  CROWDFUNDING_META, CDN_FRONTEND_BASE_URL
} from '../lib/constants'

const GallerHeading = withT(({ t }) => (
  <Interaction.H3 style={{
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center'
  }}>
    {t('pages/meta/behind/gallery')}
  </Interaction.H3>
))

const VIDEO = {
  hls: 'https://player.vimeo.com/external/302582824.m3u8?s=ff89737dc63069796cb3cd632002370aba760cd7',
  mp4: 'https://player.vimeo.com/external/302582824.hd.mp4?s=155e598b32730ef7b493d5b145576985ce65a5a1&profile_id=175',
  thumbnail: `${CDN_FRONTEND_BASE_URL}/static/video/prolong.jpg`
}

const CrowdfundingRevival = compose(
  withT,
  withMe
)(({ me, t }) => (
  <Fragment>
    <VideoCover src={VIDEO} endScroll={0.96} />
    <Center style={{ marginTop: 20, marginBottom: 60 }}>
      <Interaction.H3>{t('meta/prolong/title')}</Interaction.H3>
      <Status
        crowdfundingName={CROWDFUNDING_META}
        endDate='2019-01-15T11:00:00Z'
        memberships />
      {me && me.prolongBeforeDate !== null &&
        <TokenPackageLink params={{ package: 'PROLONG' }}>
          <Button style={{ marginBottom: 30 }} primary>{t('meta/prolong/available')}</Button>
        </TokenPackageLink>}
      {!me && <Interaction.P style={{ marginBottom: 30 }}>
        {t.elements('meta/prolong/signIn', {
          prolongLink: <Link route='pledge' params={{ package: 'PROLONG' }} passHref>
            <A>{t('meta/prolong/signIn/prolongText')}</A>
          </Link>,
          pledgeLink: <Link route='pledge' passHref>
            <A>{t('meta/prolong/signIn/pledgeText')}</A>
          </Link>
        })}
      </Interaction.P>}
      <List>
        <List.Item>Erneuern weniger als 50 Prozent von Ihnen, müssen wir radikal über die Bücher gehen – beim Produkt, bei der Strategie, beim Organigramm.</List.Item>
        <List.Item><Highlight>Erneuern etwas mehr als 50 Prozent</Highlight>, liegt ein langer, steiniger, aber machbarer Weg vor uns bis zum Punkt von 28&nbsp;000 Verlegerinnen, die wir für eine ausgeglichene Rechnung brauchen.</List.Item>
        <List.Item><Highlight>Schaffen wir, dass zwei von drei Verlegerinnen an Bord bleiben</Highlight>, liegt ebenfalls eine Menge an Risiko und Ärger vor uns. Nur wird sich dieser weit konzentrierter um das zukünftige Produkt als um die zukünftige Bilanz drehen.</List.Item>
      </List>
    </Center>
  </Fragment>
))

class MetaPage extends Component {
  static async getInitialProps () {
    return {
      galleryItems: shuffle(gallery)
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      gallery: false
    }
    this.toggleGallery = () => {
      this.setState(
        { gallery: !this.state.gallery },
        () => postMessage({
          type: !this.state.gallery
            ? 'fullscreen-enter'
            : 'fullscreen-exit'
        })
      )
    }
  }
  render () {
    const { galleryItems = [] } = this.props
    const galleryImage = galleryItems[0]
    return (
      <Front
        containerStyle={{
          maxWidth: 1200,
          margin: '0 auto'
        }}
        renderBefore={meta => (
          meta && <CrowdfundingRevival />
          /* <TitleBlock center>
            <Interaction.Headline>{meta.title}</Interaction.Headline>
            <Editorial.Lead>{meta.description}</Editorial.Lead>
          </TitleBlock> */
        )}
        renderAfter={galleryImage ? meta => (
          meta && <div style={{ marginBottom: 100 }}>
            <QuestionnaireMetaWidget />
            <Center>
              <GallerHeading />
              {this.state.gallery && <Gallery
                onClose={this.toggleGallery}
                items={galleryItems}
              />}
              <Figure>
                <div style={{ cursor: 'pointer' }} onClick={this.toggleGallery}>
                  <FigureImage
                    {...FigureImage.utils.getResizedSrcs(
                      galleryImage.src,
                      700
                    )}
                    alt={galleryImage.alt} />
                </div>
                <FigureCaption>
                  {galleryImage.caption}{' '}
                  <FigureByline>{galleryImage.credit}</FigureByline>
                </FigureCaption>
              </Figure>
            </Center>
          </div>
        ) : undefined}
        path='/verlag' />
    )
  }
}

export default MetaPage
