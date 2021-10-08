import { gql } from '@apollo/client'
import { onDocumentFragment } from '../../Bookmarks/fragments'
import { userProgressFragment } from '../Progress/api'
import { notificationInfo, subInfo } from '../../Notifications/enhancers'

export const getDocument = gql`
  query getDocument($path: String!) {
    article: document(path: $path) {
      id
      repoId
      content
      subscribedBy(includeParents: true, onlyMe: true) {
        nodes {
          ...subInfo
        }
      }
      linkedDocuments {
        nodes {
          id
          meta {
            title
            template
            path
            color
          }
          linkedDocuments(feed: true) {
            totalCount
          }
        }
      }
      unreadNotifications {
        nodes {
          ...notificationInfo
        }
      }
      ...BookmarkOnDocument
      ...UserProgressOnDocument
      meta {
        publishDate
        template
        path
        title
        kind
        description
        image
        facebookTitle
        facebookImage
        facebookDescription
        twitterTitle
        twitterImage
        twitterDescription
        seoTitle
        seoDescription
        shareText
        shareFontSize
        shareInverted
        shareTextPosition
        ownDiscussion {
          id
          closed
          isBoard
          comments {
            totalCount
          }
        }
        linkedDiscussion {
          id
          path
          closed
          comments {
            totalCount
          }
        }
        color
        format {
          id
          meta {
            path
            title
            color
            kind
            image
            shareBackgroundImage
            shareBackgroundImageInverted
            section {
              id
              meta {
                title
              }
            }
            podcast {
              podigeeSlug
              spotifyUrl
              googleUrl
              appleUrl
            }
            newsletter {
              name
              free
            }
          }
        }
        section {
          id
          meta {
            path
            title
            color
            kind
          }
        }
        dossier {
          id
          meta {
            title
            path
          }
        }
        series {
          title
          description
          logo
          logoDark
          overview {
            id
            repoId
            meta {
              path
            }
          }
          episodes {
            title
            publishDate
            label
            lead
            image
            document {
              id
              repoId
              ...BookmarkOnDocument
              ...UserProgressOnDocument
              meta {
                title
                publishDate
                path
                image
                template
                estimatedReadingMinutes
                estimatedConsumptionMinutes
                ownDiscussion {
                  id
                  closed
                  isBoard
                  comments {
                    totalCount
                  }
                }
                linkedDiscussion {
                  id
                  path
                  closed
                  comments {
                    totalCount
                  }
                }
              }
            }
          }
        }
        audioSource {
          mp3
          aac
          ogg
          mediaId
          durationMs
        }
        podcast {
          podigeeSlug
          spotifyUrl
          googleUrl
          appleUrl
        }
        newsletter {
          name
          free
        }
        disableActionBar
        estimatedReadingMinutes
        estimatedConsumptionMinutes
        indicateGallery
        indicateVideo
        prepublication
      }
    }
  }
  ${onDocumentFragment}
  ${userProgressFragment}
  ${subInfo}
  ${notificationInfo}
`

// Fetch all publicly available document-data
export const getPublicDocumentData = gql`
  query getPublicDocumentData($path: String!) {
    article: document(path: $path) {
      id
      repoId
      content
      linkedDocuments {
        nodes {
          id
          meta {
            title
            template
            path
            color
          }
          linkedDocuments(feed: true) {
            totalCount
          }
        }
      }
      meta {
        publishDate
        template
        path
        title
        kind
        description
        image
        facebookTitle
        facebookImage
        facebookDescription
        twitterTitle
        twitterImage
        twitterDescription
        seoTitle
        seoDescription
        shareText
        shareFontSize
        shareInverted
        shareTextPosition
        ownDiscussion {
          id
          closed
          isBoard
          comments {
            totalCount
          }
        }
        linkedDiscussion {
          id
          path
          closed
          comments {
            totalCount
          }
        }
        color
        format {
          id
          meta {
            path
            title
            color
            kind
            image
            shareBackgroundImage
            shareBackgroundImageInverted
            section {
              id
              meta {
                title
              }
            }
            podcast {
              podigeeSlug
              spotifyUrl
              googleUrl
              appleUrl
            }
            newsletter {
              name
              free
            }
          }
        }
        section {
          id
          meta {
            path
            title
            color
            kind
          }
        }
        dossier {
          id
          meta {
            title
            path
          }
        }
        series {
          title
          description
          logo
          logoDark
          overview {
            id
            repoId
            meta {
              path
            }
          }
          episodes {
            title
            publishDate
            label
            lead
            image
            document {
              id
              repoId
              meta {
                title
                publishDate
                path
                image
                template
                estimatedReadingMinutes
                estimatedConsumptionMinutes
                ownDiscussion {
                  id
                  closed
                  isBoard
                  comments {
                    totalCount
                  }
                }
                linkedDiscussion {
                  id
                  path
                  closed
                  comments {
                    totalCount
                  }
                }
              }
            }
          }
        }
        audioSource {
          mp3
          aac
          ogg
          mediaId
          durationMs
        }
        podcast {
          podigeeSlug
          spotifyUrl
          googleUrl
          appleUrl
        }
        newsletter {
          name
          free
        }
        disableActionBar
        estimatedReadingMinutes
        estimatedConsumptionMinutes
        indicateGallery
        indicateVideo
      }
    }
  }
`

// Fetch all of the users data that belong to the document with the given repoId
export const getDocumentUserData = gql`
  query getDocumentUserState($repoId: ID!) {
    article: document(repoId: $repoId) {
      id
      subscribedBy(includeParents: true, onlyMe: true) {
        nodes {
          ...subInfo
        }
      }
      unreadNotifications {
        nodes {
          ...notificationInfo
        }
      }
      ...UserProgressOnDocument
      ...BookmarkOnDocument
    }
  }
  ${onDocumentFragment}
  ${userProgressFragment}
  ${subInfo}
  ${notificationInfo}
`
