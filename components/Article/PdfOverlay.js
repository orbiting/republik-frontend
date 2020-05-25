import React, { Component, Fragment } from 'react'

import {
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarConfirm,
  Interaction,
  A,
  Button,
  Checkbox
} from '@project-r/styleguide'
import { MdFileDownload, MdClose } from 'react-icons/md'
import withT from '../../lib/withT'
import { ASSETS_SERVER_BASE_URL } from '../../lib/constants'

export const getPdfUrl = (meta, { images = true, download = false } = {}) => {
  const query = [!images && 'images=0', download && 'download=1'].filter(
    Boolean
  )
  return `${ASSETS_SERVER_BASE_URL}/pdf${meta.path}.pdf${
    query.length ? `?${query.join('&')}` : ''
  }`
}

const matchFigure = node => node.type === 'zone' && node.identifier === 'FIGURE'
const matchVideo = node =>
  node.type === 'zone' &&
  node.identifier === 'EMBEDVIDEO' &&
  node.data.forceAudio

export const countImages = element => {
  if (matchFigure(element) || matchVideo(element)) {
    return 1
  }
  return (element.children || []).reduce(
    (count, node) => count + countImages(node),
    0
  )
}

class PdfOverlay extends Component {
  constructor(props) {
    super(props)

    this.state = {
      images: true
    }
  }
  render() {
    const { onClose, article, t } = this.props
    const { images } = this.state

    const imageCount = countImages(article.content)

    return (
      <Overlay
        onClose={onClose}
        mUpStyle={{ maxWidth: 300, minHeight: 'none' }}
      >
        <OverlayToolbar>
          <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
            {t('article/pdf/title')}
          </Interaction.Emphasis>
          <OverlayToolbarConfirm
            onClick={onClose}
            label={<MdClose size={24} fill='#000' />}
          />
        </OverlayToolbar>
        <OverlayBody>
          {!!imageCount && (
            <Fragment>
              <Checkbox
                checked={images}
                onChange={(_, checked) => {
                  this.setState({ images: checked })
                }}
              >
                {t.pluralize('article/pdf/images', {
                  count: imageCount
                })}
              </Checkbox>
              <br />
              <br />
            </Fragment>
          )}
          <Button
            block
            onClick={e => {
              e.preventDefault()
              window.location = getPdfUrl(article.meta, { images })
            }}
          >
            {t('article/pdf/open')}
          </Button>
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <A
              target='_blank'
              href={getPdfUrl(article.meta, {
                images,
                download: true
              })}
              download
            >
              <MdFileDownload /> {t('article/pdf/download')}
            </A>
          </div>
        </OverlayBody>
      </Overlay>
    )
  }
}

export default withT(PdfOverlay)
