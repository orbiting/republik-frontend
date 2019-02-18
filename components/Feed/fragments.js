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
      estimatedConsumptionMinutes
      indicateChart
      indicateGallery
      indicateVideo
      audioSource {
        mp3
      }
      dossier {
        id
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
