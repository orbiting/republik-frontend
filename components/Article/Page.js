import React, { Component } from 'react'
import { css } from 'glamor'
import Frame from '../Frame'
import ShareButtons from '../Share'

import {
  Center,
  Editorial,
  TitleBlock,
  colors,
  mediaQueries
} from '@project-r/styleguide'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

const styles = {
  bar: css({
    display: 'inline-block',
    marginTop: '15px',
    [mediaQueries.mUp]: {
      marginTop: '20px'
    }
  })
}

const ActionBar = props => (
  <div>
    <ShareButtons
      {...props}
      fill={colors.text}
      dossierUrl={'/foo'}
      discussionUrl={'/foo'}
      discussionCount={0}
    />
  </div>
)

class ArticlePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showSecondary: false
    }

    this.onScroll = () => {
      const y = window.pageYOffset
      const mobile = window.innerWidth < mediaQueries.mBreakPoint

      if (
        y + (mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT) >
        this.y + this.barHeight
      ) {
        if (!this.state.showSecondary) {
          this.setState({ showSecondary: true })
        }
      } else {
        if (this.state.showSecondary) {
          this.setState({ showSecondary: false })
        }
      }
    }
    this.barRef = ref => {
      this.bar = ref
    }
    this.measure = () => {
      if (this.bar) {
        const rect = this.bar.getBoundingClientRect()
        this.y = window.pageYOffset + rect.top
        this.barHeight = rect.height
        this.x = window.pageXOffset + rect.left
      }
      this.onScroll()
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
    this.measure()
  }
  componentDidUpdate () {
    this.measure()
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }

  render () {
    const { url, meta } = this.props
    return (
      <Frame
        raw
        url={url}
        meta={meta}
        secondaryNav={<ActionBar />}
        showSecondary={this.state.showSecondary}
      >
        <Center>
          <TitleBlock>
            <Editorial.Format>Neutrum</Editorial.Format>
            <Editorial.Headline>
              A demo page for navigation magic on&nbsp;scroll
            </Editorial.Headline>
            <Editorial.Lead>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores.
            </Editorial.Lead>
            <Editorial.Credit>
              An article by{' '}
              <Editorial.AuthorLink href='#'>
                Christof Moser
              </Editorial.AuthorLink>, 31 December 2017
            </Editorial.Credit>
            <div ref={this.barRef} {...styles.bar}>
              <ActionBar />
            </div>
          </TitleBlock>
          <Editorial.P>
            One morning, when Gregor Samsa woke from troubled dreams, he found
            himself transformed in his bed into a horrible vermin. He lay on his
            armour-like back, and if he lifted his head a little he could see
            his brown belly, slightly domed and divided by arches into stiff
            sections. The bedding was hardly able to cover it and seemed ready
            to slide off any moment. His many legs, pitifully thin compared with
            the size of the rest of him, waved about helplessly as he looked.
            "What's happened to me?" he thought.
          </Editorial.P>
          <Editorial.P>
            One morning, when Gregor Samsa woke from troubled dreams, he found
            himself transformed in his bed into a horrible vermin. He lay on his
            armour-like back, and if he lifted his head a little he could see
            his brown belly, slightly domed and divided by arches into stiff
            sections. The bedding was hardly able to cover it and seemed ready
            to slide off any moment. His many legs, pitifully thin compared with
            the size of the rest of him, waved about helplessly as he looked.
            "What's happened to me?" he thought.
          </Editorial.P>

          <Editorial.P>
            One morning, when Gregor Samsa woke from troubled dreams, he found
            himself transformed in his bed into a horrible vermin. He lay on his
            armour-like back, and if he lifted his head a little he could see
            his brown belly, slightly domed and divided by arches into stiff
            sections. The bedding was hardly able to cover it and seemed ready
            to slide off any moment. His many legs, pitifully thin compared with
            the size of the rest of him, waved about helplessly as he looked.
            "What's happened to me?" he thought.
          </Editorial.P>
        </Center>
      </Frame>
    )
  }
}

export default ArticlePage
