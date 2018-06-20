import { inNativeAppBrowser } from '../lib/withInNativeApp'

export const HEADER_HEIGHT = inNativeAppBrowser ? 0 : 70
export const HEADER_HEIGHT_MOBILE = inNativeAppBrowser ? 0 : 45
export const TESTIMONIAL_IMAGE_SIZE = 238
export const CONTENT_PADDING = 60

export const ZINDEX_LOADINGBAR = 30
export const ZINDEX_HEADER = 20
export const ZINDEX_CONTENT = 15
export const ZINDEX_FOOTER = 11
export const ZINDEX_SIDEBAR = 10
export const ZINDEX_FRAME_TOGGLE = 1
