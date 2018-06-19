import { Component } from 'react'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { css } from 'glamor'
import { mediaQueries, colors } from '@project-r/styleguide'

const SIDEBAR_WIDTH = 120
const MARGIN_WIDTH = 20
const STICKY_HEADER_HEIGHT = 27

const style = {
  header: css({
    backgroundColor: '#fff',
    margin: '0 0 30px 0',
    width: '100%',
    height: STICKY_HEADER_HEIGHT,
    [mediaQueries.lUp]: {
      height: 'auto',
      float: 'left',
      margin: `0 0 30px -${SIDEBAR_WIDTH + MARGIN_WIDTH}px`,
      width: SIDEBAR_WIDTH,
      '& > div': {
        width: SIDEBAR_WIDTH
      }
    }
  }),
  label: css({
    padding: '8px 0',
    borderTop: '1px solid #000',
    position: 'relative',
    backgroundColor: '#fff',
    width: '100%'
  }),
  sticky: css({
    top: HEADER_HEIGHT - 1,
    [mediaQueries.onlyS]: {
      top: HEADER_HEIGHT_MOBILE - 1,
      borderBottom: `0.5px solid ${colors.divider}`
    }
  })
}

class StickySection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sticky: false,
      isMobile: true,
      stickyLabelOffset: 0
    }
    this.sectionRef = null
    this.setSectionRef = (el) => { this.sectionRef = el }

    this.onScroll = () => {
      if (this.sectionRef) {
        const { sticky } = this.state
        const y = window.pageYOffset + this.getHeaderHeight()
        const { height, offset } = this.measure()
        const nextSticky = (offset + height + STICKY_HEADER_HEIGHT > y) && (y > offset)
        sticky !== nextSticky && this.setState({sticky: nextSticky})
      }
    }

    this.handleResize = () => {
      const isMobile = window.innerWidth < mediaQueries.lBreakPoint
      this.setState({
        isMobile
      })
    }

    this.measure = () => {
      if (this.sectionRef && window) {
        const { width, height, top } = this.sectionRef.getBoundingClientRect()
        const offset = this.sectionRef.offsetTop
        return {
          top,
          width,
          height,
          offset
        }
      } else {
        return {
          top: 0,
          width: 0,
          height: 0,
          offset: 0
        }
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
    this.handleResize()
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.handleResize)
  }

  render () {
    const { children, label } = this.props
    const { sticky, isMobile } = this.state
    const { width } = this.measure()
    return (
      <section ref={this.setSectionRef}>
        <div {...style.header}>
          <div
            {...style.label}
            {...(sticky && style.sticky)}
            style={{
              position: sticky ? 'fixed' : 'relative',
              width: isMobile ? width : SIDEBAR_WIDTH
            }}>
            {
              label
            }
          </div>
        </div>
        <div>
          {
            children
          }
        </div>
      </section>
    )
  }
}

export default StickySection
