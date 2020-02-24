import React from 'react'
import { css } from 'glamor'

import { Container, mediaQueries } from '@project-r/styleguide'

import Sidebar from './Sidebar'
import { CONTENT_PADDING, SIDEBAR_WIDTH } from './constants'

const styles = {
  sidebar: css({
    paddingTop: 25,
    [mediaQueries.mUp]: {
      float: 'right',
      width: SIDEBAR_WIDTH
    }
  }),
  content: css({
    paddingTop: 20,
    [mediaQueries.mUp]: {
      paddingRight: CONTENT_PADDING + SIDEBAR_WIDTH
    },
    [mediaQueries.lUp]: {
      paddingRight: CONTENT_PADDING * 2 + SIDEBAR_WIDTH
    }
  }),
  indention: css({
    [mediaQueries.mUp]: {
      paddingLeft: CONTENT_PADDING
    }
  })
}

const Content = ({ children, indented, ...props }) => (
  <div {...props} {...styles.content} {...(indented ? styles.indention : {})}>
    {children}
  </div>
)

const ContainerWithSidebar = ({ sidebarProps, children }) => {
  const [sticky, setSticky] = React.useState({})

  return (
    <Container>
      <div {...styles.sidebar}>
        <Sidebar {...sidebarProps} sticky={sticky} setSticky={setSticky} />
      </div>
      <Content indented>{children}</Content>
    </Container>
  )
}

export default ContainerWithSidebar
