import { Component } from 'react'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { css } from 'glamor'
import { mediaQueries } from '@project-r/styleguide/lib/lib'

const stickyHeaderStyle = {
  base: css({
    paddingTop: '8px',
    borderTop: '1px solid #000',
    position: 'relative',
    backgroundColor: '#fff',
    width: '100%'
  }),
  sticky: css({
    position: 'fixed',
    top: HEADER_HEIGHT_MOBILE - 1,
    [mediaQueries.lUp]: {
      top: HEADER_HEIGHT - 1
    }
  })
}

class StickyHeader extends Component {
  constructor (props) {
    super(props)
    this.originalOffset = null
    this.state = {
      sticky: false
    }
    this.ref = null
    this.setRef = (el) => { this.ref = el }

    this.onScroll = () => {
      const y = window.pageYOffset
      if (this.ref) {
        const { sticky } = this.state
        const currentOffset = this.ref.offsetTop
        const nextSticky = y + HEADER_HEIGHT > (sticky ? this.originalOffset : currentOffset)
        this.setState({ sticky: nextSticky })
      }
    }
  }

  componentDidMount () {
    this.originalOffset = this.ref.offsetTop
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
  }

  render () {
    const {children} = this.props
    const { sticky } = this.state
    return (
      <div
        ref={this.setRef}
        {...stickyHeaderStyle.base}
        className={sticky ? stickyHeaderStyle.sticky.toString() : ''}
      >
        {
          children
        }
      </div>
    )
  }
}

export default StickyHeader
