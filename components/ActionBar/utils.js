import { routes } from '../../lib/routes'

export const getDiscussionIconLinkProps = (linkedDiscussion, ownDiscussion, template, path) => {
  const isLinkedDiscussion =
    linkedDiscussion &&
    template === 'article' &&
    (!linkedDiscussion.closed || (linkedDiscussion.comments && linkedDiscussion.comments.totalCount > 0))
  const isOwnDiscussion =
    !isLinkedDiscussion &&
    ownDiscussion &&
    (!ownDiscussion.closed || (ownDiscussion.comments && ownDiscussion.comments.totalCount > 0))
  const isArticleAutoDiscussion = isOwnDiscussion && template === 'article'
  const isDiscussionPage = isOwnDiscussion && template === 'discussion'
  const discussionCount =
    (isLinkedDiscussion && linkedDiscussion.comments && linkedDiscussion.comments.totalCount) ||
    (isOwnDiscussion && ownDiscussion.comments && ownDiscussion.comments.totalCount) || undefined

  const discussionId =
    (isLinkedDiscussion && linkedDiscussion.id) ||
    (isOwnDiscussion && ownDiscussion.id) ||
    undefined
  const discussionPath =
    (isLinkedDiscussion && linkedDiscussion.path) ||
    (isArticleAutoDiscussion && routes.find(r => r.name === 'discussion').toPath()) ||
    (isDiscussionPage && path) ||
    undefined
  const discussionQuery = isArticleAutoDiscussion ? { t: 'article', id: ownDiscussion.id } : undefined

  return {
    discussionId,
    discussionPath,
    discussionQuery,
    discussionCount,
    isDiscussionPage
  }
}

export const copyToClipboard = (url) => {
  if (window.clipboardData && window.clipboardData.setData) {
    // IE specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData('Text', url)
  } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    const textarea = document.createElement('textarea')
    textarea.textContent = url
    textarea.style.position = 'fixed'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      return document.execCommand('copy')
    } catch (ex) {
      console.warn('Copy to clipboard failed.', ex)
      return false
    } finally {
      document.body.removeChild(textarea)
    }
  }
}
