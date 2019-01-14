import { onDocumentFragment as bookmarkOnDocumentFragment } from '../Bookmarks/fragments'

export const documentFragment = `
  fragment DocumentListDocument on Document {
    id
    ...BookmarkOnDocument
    meta {
      credits
      title
      description
      publishDate
      path
      kind
      template
      color
      estimatedReadingMinutes
      indicateChart
      indicateGallery
      indicateVideo
      audioSource {
        mp3
      }
      dossier {
        id
      }
      ownDiscussion {
        id
        closed
        comments(first: 0) {
          totalCount
        }
      }
      linkedDiscussion {
        id
        path
        closed
        comments(first: 0) {
          totalCount
        }
      }
      format {
        meta {
          path
          title
          color
          kind
        }
      }
    }
  }
  ${bookmarkOnDocumentFragment}
`
