import { APP_OPTIONS } from '../../lib/constants'

export const DISCUSSION_NOTIFICATION_CHANNELS = [
  'EMAIL',
  APP_OPTIONS && 'APP',
  'WEB'
].filter(Boolean)

export const DISCUSSION_NOTIFICATION_OPTIONS = [
  'MY_CHILDREN',
  'ALL',
  'NONE'
]
