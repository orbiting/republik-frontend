import { ASSETS_SERVER_BASE_URL, RENDER_FRONTEND_BASE_URL } from '../../lib/constants'

export const renderWidth = 1200
export const getSmallImgSrc = teaser => `${ASSETS_SERVER_BASE_URL}/render?width=${renderWidth}&height=1&url=${encodeURIComponent(`${RENDER_FRONTEND_BASE_URL}/?extractId=${teaser.id}`)}&resize=200${teaser.contentHash ? `&permanentCacheKey=${encodeURIComponent(teaser.contentHash)}` : ''}`

export const getTeasersFromDocument = doc => {
  if (!doc) {
    return []
  }
  const children = doc.children
    ? doc.children.nodes.map(c => c.body)
    : doc.content.children

  return children.map(rootChild => {
    return {
      id: rootChild.data.id,
      contentHash: rootChild.data.contentHash,
      nodes: rootChild.identifier === 'TEASERGROUP'
        ? rootChild.children
        : [rootChild]
    }
  })
}
