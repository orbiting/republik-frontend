import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Gallery from './Gallery'
import get from 'lodash/get'
import { imageSizeInfo } from 'mdast-react-render/lib/utils'
import { postMessage } from '../../lib/withInNativeApp'

const shouldInclude = el =>
  el &&
  el.identifier === 'FIGURE' &&
  get(el, 'data.excludeFromGallery', false) !== true

const findFigures = (node, acc = []) => {
  if (node && node.children && node.children.length > 0) {
    node.children.forEach(c => {
      if (shouldInclude(c)) {
        acc.push(c)
      } else {
        findFigures(c, acc)
      }
    })
  }
  return acc
}

const getImageProps = node => {
  const src = get(node, 'children[0].children[0].url', '')
  const title = get(node, 'children[1].children[0].value', '')
  const author = get(node, 'children[1].children[1].children[0].value', '')
  return {
    src,
    title,
    author
  }
}

const getGalleryItems = ({ article }) => {
  return findFigures(article.content)
    .map(getImageProps)
    .filter(i => imageSizeInfo(i.src) && imageSizeInfo(i.src).width > 600)
}

const removeQuery = (url = '') => url.split('?')[0]

class ArticleGallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      startItemSrc: null
    }

    this.toggleGallery = (nextSrc = '') => {
      const nextShow = !this.state.show
      const { galleryItems } = this.state
      if (
        nextShow &&
        galleryItems.some(i => removeQuery(i.src) === removeQuery(nextSrc))
      ) {
        this.setState(
          {
            show: true,
            startItemSrc: nextSrc
          },
          () => postMessage({ type: 'fullscreen-enter' })
        )
      } else {
        this.setState(
          {
            show: false,
            startItemSrc: null
          },
          () => postMessage({ type: 'fullscreen-exit' })
        )
      }
    }

    this.show = () => {
      const { galleryItems } = this.state
      if (galleryItems && !!galleryItems.length && !this.state.show) {
        this.toggleGallery(galleryItems[0].src)
      }
    }

    this.getChildContext = () => ({
      toggleGallery: this.toggleGallery
    })
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      galleryItems: getGalleryItems(nextProps)
    }
  }

  componentDidMount() {
    if (this.props.show) {
      this.show()
    }
  }

  render() {
    const { children } = this.props
    const { article } = this.props
    const { show, startItemSrc, galleryItems } = this.state
    const enabled = get(article, 'content.meta.gallery', true)
    return (
      <Fragment>
        {article.content && enabled && show && (
          <Gallery
            onClose={this.toggleGallery}
            items={galleryItems}
            startItemSrc={startItemSrc}
          />
        )}
        {children}
      </Fragment>
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
