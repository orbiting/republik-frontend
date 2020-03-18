// Utilities for browser notifications API.

export const isNotificationSupported = () => {
  return typeof window !== 'undefined' && window.Notification
}

export const getNotificationPermission = () => {
  return isNotificationSupported() ? window.Notification.permission : null
}
