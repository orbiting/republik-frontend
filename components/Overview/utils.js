import { ASSETS_SERVER_BASE_URL, RENDER_FRONTEND_BASE_URL } from '../../lib/constants'

export const renderWidth = 1200
export const getSmallImgSrc = teaser => `${ASSETS_SERVER_BASE_URL}/render?width=${renderWidth}&height=1&url=${encodeURIComponent(`${RENDER_FRONTEND_BASE_URL}/?extractId=${teaser.id}`)}&resize=160`
