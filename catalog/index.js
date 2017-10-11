import React from "react"
import ReactDOM from "react-dom"
import {Catalog, pageLoader} from "catalog"
import {fontFaces} from '@project-r/styleguide'
import theme from './catalogTheme'

const styleTag = document.createElement('style')
styleTag.innerHTML = fontFaces()
document.body.appendChild(styleTag)

const pages = [
  {
    path: "/",
    title: "Welcome",
    content: pageLoader(() => import("./WELCOME.md"))
  },
  {
    path: "/discussion",
    title: "Discussion",
    pages: [
      {
        path: '/discussion/comment',
        title: "Comment",
        imports: {
          profilePicture: require('!!file-loader!./static/profilePicture.png'),
          ...require('../components/Discussion/Comment')
        },
        component: pageLoader(() => import("../components/Discussion/Comment/docs.md"))
      },
      {
        path: '/discussion/comment-node',
        title: "CommentNode",
        imports: {
          comments: {...require('../components/Discussion/CommentNode/comments')},
          profilePicture: require('!!file-loader!./static/profilePicture.png'),
          ...require('../components/Discussion/CommentNode')
        },
        component: pageLoader(() => import("../components/Discussion/CommentNode/docs.md"))
      },
      {
        path: '/discussion/inline-comment-composer',
        title: "InlineCommentComposer",
        imports: {
          ...require('../components/Discussion/InlineCommentComposer')
        },
        component: pageLoader(() => import("../components/Discussion/InlineCommentComposer/docs.md"))
      }
    ]
  }
]

ReactDOM.render(
  <Catalog
    theme={theme}
    title="Catalog"
    pages={pages}
  />,
  document.getElementById("catalog")
)
