
export const onDocumentFragment = `
fragment BookmarkOnDocument on Document {
  userListItems {
    id
    createdAt
    list {
      id
      name
    }
  }
}
`
