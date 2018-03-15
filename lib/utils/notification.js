// Utilities for browser notifications API.

export const isClient = () => {
  return typeof window !== 'undefined'
}

export const isNotificationSupported = () => {
  return isClient() && window.Notification
}

export const getNotificationPermission = () => {
  return isNotificationSupported() ? window.Notification.permission : null
}
