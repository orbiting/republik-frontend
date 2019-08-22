import React, { Component } from 'react'
import { shuffle } from 'd3-array'

import { postMessage } from '../lib/withInNativeApp'

import Front from '../components/Front'

import {
  TitleBlock,
  Editorial,
  Interaction,
  Center,
  Figure,
  FigureImage,
  FigureCaption,
  FigureByline
} from '@project-r/styleguide'
import QuestionnaireMetaWidget from '../components/Questionnaire/QuestionnaireMetaWidget'
import { data as gallery } from '../lib/meta/gallery.json'
import withT from '../lib/withT'
import Gallery from '../components/Gallery/Gallery'

const GallerHeading = withT(({ t }) => (
  <Interaction.H3 style={{
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center'
  }}>
    {t('pages/meta/behind/gallery')}
  </Interaction.H3>
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
    const containerStyle = {
      maxWidth: 1200,
      margin: '0 auto'
    }
    return (
      <Front
        containerStyle={containerStyle}
        renderBefore={meta => (
          meta && <TitleBlock center>
            <Interaction.Headline>{meta.title}</Interaction.Headline>
            <Editorial.Lead>{meta.description}</Editorial.Lead>
          </TitleBlock>
        )}
        renderAfter={galleryImage ? meta => (
          meta && <div style={{ ...containerStyle, marginBottom: 100 }}>
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
