import React from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default'
import { imageSizeInfo, imageResizeUrl } from 'mdast-react-render/lib/utils'
import { Spinner, useHeaderHeight } from '@project-r/styleguide'

import withT from '../../lib/withT'
import { withTester } from '../Auth/checkRoles'
import photoswipeStyle from './photoswipeStyle'

const removeQuery = (url = '') => url.split('?')[0]

const MAX_SPREAD_ZOOM = 2

const Gallery = ({ items, onClose, startItemSrc, children, t, isTester }) => {
  const galleryRef = React.useRef(null)
  const [headerHeight] = useHeaderHeight()

  React.useEffect(() => {
    if (galleryRef) {
      const startIndex = items.findIndex(
        i => removeQuery(i.src) === removeQuery(startItemSrc)
      )

      const options = {
        modal: true,
        index: startIndex,
        closeOnScroll: false,
        maxSpreadZoom: MAX_SPREAD_ZOOM,
        shareEl: false,
        indexIndicatorSep: '/',
        preload: [1, 2],
        barsSize: { top: 65, bottom: 'auto' },
        history: false,
        errorMsg: `<div class="pswp__error-msg"><a href="%url%" target="_blank">${t(
          'article/gallery/error'
        )}</a></div>`,
        addCaptionHTMLFn: (item, captionEl) => {
          let caption = ''
          if (item.title) {
            caption = item.title.trim()
          }
          if (item.author) {
            if (caption.length) {
              caption += ' '
            }
            caption += `<small>${item.author}</small>`
          }
          captionEl.children[0].innerHTML = caption
          return caption.length > 0
        }
      }

      const gallery = new PhotoSwipe(
        galleryRef.current,
        PhotoSwipeUIDefault,
        items,
        options
      )

      gallery.listen('gettingData', function(index, item) {
        const sizeInfo = imageSizeInfo(item.src)
        const maxWidth = Math.min(
          sizeInfo.width,
          Math.ceil((window.innerWidth * MAX_SPREAD_ZOOM) / 500) * 500
        )
        const resizeUrl = imageResizeUrl(item.src, maxWidth)
        const aspectRatio = sizeInfo.height / sizeInfo.width
        item.src = resizeUrl
        item.w = maxWidth
        item.h = aspectRatio * maxWidth
      })
      gallery.listen('close', onClose)
      gallery.init()
    }
  }, [items])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: photoswipeStyle }} />
      <div
        ref={galleryRef}
        className='pswp'
        tabIndex='-1'
        role='dialog'
        style={{
          background: '#000',
          top: isTester && headerHeight,
          height: isTester && `calc(100vh - ${headerHeight}px)`
        }}
      >
        <div className='pswp__bg' />
        <div className='pswp__scroll-wrap'>
          <div className='pswp__container'>
            <div className='pswp__item' />
            <div className='pswp__item' />
            <div className='pswp__item' />
          </div>
          <div className='pswp__ui pswp__ui--hidden'>
            <div className='pswp__top-bar'>
              <div className='pswp__counter' />
              <button
                className='pswp__button pswp__button--close'
                title={t('article/gallery/close')}
              />
              <div className='pswp__preloader'>
                <Spinner />
              </div>
            </div>

            <button
              className='pswp__button pswp__button--arrow--left'
              title={t('article/gallery/back')}
            />
            <button
              className='pswp__button pswp__button--arrow--right'
              title={t('article/gallery/forward')}
            />
            <div className='pswp__caption'>
              <div className='pswp__caption__center' />
            </div>
          </div>
        </div>
      </div>
      {children}
    </>
  )
}

export default compose(withTester, withT)(Gallery)
