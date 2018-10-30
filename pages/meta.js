import React, { Component } from 'react'
import { shuffle } from 'd3-array'

import { postMessage } from '../lib/withInNativeApp'

import Front from '../components/Front'

import {
  Interaction,
  Editorial,
  TitleBlock,
  Center,
  Gallery,
  Figure,
  FigureImage,
  FigureCaption,
  FigureByline

} from '@project-r/styleguide'
import QuestionnaireMetaWidget from '../components/Questionnaire/QuestionnaireMetaWidget'
import { data as BEHIND_GALLERY } from '../lib/meta/gallery.json'

class MetaPage extends Component {
  static async getInitialProps () {
    return {
      galleryItems: shuffle(BEHIND_GALLERY)
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
        renderBefore={meta => (
          <div style={{ marginTop: 20 }}>
            { meta &&
              <div>
                <TitleBlock center>
                  <Interaction.Headline>{meta.title}</Interaction.Headline>
                  <Editorial.Lead>{meta.description}</Editorial.Lead>
                </TitleBlock>
              </div>
            }
            <QuestionnaireMetaWidget />
          </div>
        )}
        renderAfter={galleryImage ? () => (
          <Center style={{ marginBottom: 100 }}>
            <Interaction.H3 style={{
              marginTop: 30,
              marginBottom: 20,
              textAlign: 'center'
            }}>
              Bilder aus der Redaktion
            </Interaction.H3>
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
        ) : undefined}
        path='/verlag' />
    )
  }
}

export default MetaPage
