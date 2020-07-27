import { onDocumentFragment as bookmarkOnDocumentFragment } from '../Bookmarks/fragments'
import { userProgressFragment } from '../Article/Progress/api'

export const documentFragment = `
  fragment FeedDocument on Document {
    id
    ...BookmarkOnDocument
    ...UserProgressOnDocument
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
      estimatedConsumptionMinutes
      indicateChart
      indicateGallery
      indicateVideo
      audioSource {
        mp3
        aac
        ogg
        mediaId
        durationMs
      }
      dossier {
        id
      }
      format {
        id
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
  ${userProgressFragment}
`
