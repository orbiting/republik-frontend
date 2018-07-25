import React from 'react'
import PropTypes from 'prop-types'
import { Gallery } from '@project-r/styleguide/lib/components/Gallery'
import get from 'lodash.get'
import memoize from 'lodash.memoize'
import {
  imageSizeInfo
} from 'mdast-react-render/lib/utils'

const shouldInclude = (el) =>
  get(el, 'identifier', '') === 'FIGURE' && get(el, 'data.excludeFromGallery', false) !== true

const findFigures = (node, acc = []) => {
  if (get(node, 'children.length', 0) > 0) {
    node.children.forEach(
      c => {
        if (shouldInclude(c)) {
          acc.push(c)
        } else {
          findFigures(c, acc)
        }
      }
    )
  }
  return acc
}
const getImageProps = (node) => {
  const src = get(node, 'children[0].children[0].url', '')
  const alt = get(node, 'children[0].children[0].alt', '')
  const caption = get(node, 'children[1].children[0].value', '')
  const credit = get(node, 'children[1].children[1].children[0].value', '')
  return {
    src,
    alt,
    caption,
    credit
  }
}

class ArticleGallery extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      startItemSrc: null
    }

    this.getGalleryItems = memoize(() => {
      const { article } = this.props
      return findFigures(article.content)
        .map(getImageProps)
        .filter(i => imageSizeInfo(i.src).width > 600)
    })

    this.renderGallery = () => {
      const { article } = this.props
      const { show, startItemSrc } = this.state
      const enabled = get(article, 'content.meta.gallery', false)
      if (article.content && enabled && show) {
        const galleryItems = this.getGalleryItems()
        return (
          <Gallery
            onClose={() => { this.setState(({ show }) => ({ show: !show })) }}
            items={galleryItems}
            startItemSrc={startItemSrc}
          />
        )
      } else {
        return null
      }
    }

    this.toggleGallery = (nextSrc = '') => {
      if (this.getGalleryItems().some(i => i.src === nextSrc.split('&')[0])) {
        this.setState(({ show, nextSrc }) => ({
          show: !show,
          startItemSrc: nextSrc
        }))
      }
    }

    this.getChildContext = () => ({
      toggleGallery: this.toggleGallery
    })
  }

  render () {
    const { children } = this.props
    return (
      <React.Fragment>
        { this.renderGallery() }
        { children }
      </React.Fragment>
    )
  }
}

ArticleGallery.propTypes = {
  article: PropTypes.object.isRequired
}

ArticleGallery.childContextTypes = {
  toggleGallery: PropTypes.func
}

export default ArticleGallery
