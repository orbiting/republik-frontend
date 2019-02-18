import { Logo } from '@project-r/styleguide'

export const HEADER_HEIGHT = 60
export const HEADER_HEIGHT_MOBILE = 45
export const NAVBAR_HEIGHT = 41
export const NAVBAR_HEIGHT_MOBILE = 36

export const LOGO_HEIGHT = 28.02
export const LOGO_WIDTH = LOGO_HEIGHT * Logo.ratio
export const LOGO_PADDING = Math.floor((HEADER_HEIGHT - LOGO_HEIGHT - 1) / 2)

export const LOGO_HEIGHT_MOBILE = 22.78
export const LOGO_WIDTH_MOBILE = LOGO_HEIGHT_MOBILE * Logo.ratio
export const LOGO_PADDING_MOBILE = Math.floor((HEADER_HEIGHT_MOBILE - LOGO_HEIGHT_MOBILE - 1) / 2)

export const TESTIMONIAL_IMAGE_SIZE = 238
export const CONTENT_PADDING = 60

export const ZINDEX_LOADINGBAR = 30
export const ZINDEX_POPOVER = 25
export const ZINDEX_HEADER = 20
export const ZINDEX_NAVBAR = 19
export const ZINDEX_BOTTOM_PANEL = 16
export const ZINDEX_CONTENT = 15
export const ZINDEX_FOOTER = 11
export const ZINDEX_SIDEBAR = 10
export const ZINDEX_FEED_STICKY_SECTION_LABEL = 2
export const ZINDEX_FRAME_TOGGLE = 1

export const DEFAULT_TOKEN_TYPE = 'EMAIL_TOKEN'
export const SUPPORTED_TOKEN_TYPES = [DEFAULT_TOKEN_TYPE, 'APP']
