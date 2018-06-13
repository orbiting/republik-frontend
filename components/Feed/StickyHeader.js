import { Component } from 'react'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { css } from 'glamor'
import { mediaQueries } from '@project-r/styleguide'

const style = {
  base: css({
    padding: '8px 0',
    borderTop: '1px solid #000',
    position: 'relative',
    backgroundColor: '#fff',
    width: '100%'
  }),
  sticky: css({
    top: HEADER_HEIGHT - 1,
    [mediaQueries.onlyS]: {
      top: HEADER_HEIGHT_MOBILE - 1
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
        const nextSticky = y + this.getHeaderHeight() > (sticky ? this.originalOffset : currentOffset)
        this.setState({ sticky: nextSticky })
      }
    }

    this.getHeaderHeight = () => {
      if (window.innerWidth >= mediaQueries.mBreakPoint) {
        return HEADER_HEIGHT
      } else {
        return HEADER_HEIGHT_MOBILE
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
    const { children } = this.props
    const { sticky } = this.state
    return (
      <div
        ref={this.setRef}
        {...style.base}
        {...(sticky && style.sticky)}
        style={{position: sticky ? 'fixed' : 'relative'}}
      >
        {
          children
        }
      </div>
    )
  }
}

export default StickyHeader
