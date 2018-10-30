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
import MetaWidget from '../components/Questionnaire/MetaWidget'

const BEHIND_GALLERY = [
  {
    src: 'https://assets.publikator.project-r.construction/assets/orbiting/newsletter-rechfertigungs-newsletter/images/9ac942f4bbf7876e274a8431c090e2569396b243.jpeg?size=4026x2265&resize=2000x',
    alt: 'Lorem ipsum dolor',
    caption: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligulaeget dolor.',
    credit: 'Laurent Burst'
  },
  {
    src: 'https://assets.project-r.construction/images/header_jobs.jpg',
    alt: 'Lorem ipsum dolor',
    caption: 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly.',
    credit: 'Laurent Burst'
  },
  {
    src: 'https://cdn.republik.space/s3/republik-assets/github/republik/newsletter-editorial-03-02-18/images/3441a605f74e9354e1ab4ce8765eda3fcbe691e7.jpeg?size=3503x1970&resize=1280x',
    alt: 'Lorem ipsum dolor',
    caption: 'One morning, when Gregor Samsa woke from troubled dreams.',
    credit: 'Laurentine Verylong Burst'
  }
]

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
            <MetaWidget />
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
                  src={galleryImage.src}
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
