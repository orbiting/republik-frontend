import { Component } from 'react'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { css } from 'glamor'
import { mediaQueries, colors } from '@project-r/styleguide'
import PropTypes from 'prop-types'

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
    top: HEADER_HEIGHT_MOBILE - 1,
    borderBottom: `0.5px solid ${colors.divider}`,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT - 1
    },
    [mediaQueries.lUp]: {
      borderBottom: 'none'
    }
  })
}

class StickySection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sticky: false,
      isMobile: true
    }
    this.sectionRef = null
    this.setSectionRef = (el) => { this.sectionRef = el }

    this.onScroll = () => {
      if (this.sectionRef) {
        const { sticky, isMobile } = this.state
        const { spaceAfter } = this.props
        const y = window.pageYOffset + (isMobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT)
        const { height, offset } = this.measure()
        const nextSticky = (y > offset) && // scroll pos is above top of section
          (offset + height + (spaceAfter ? STICKY_HEADER_HEIGHT : 0) > y) // scroll pos is below bottom
        if (sticky !== nextSticky) {
          this.setState({sticky: nextSticky})
        }
      }
    }

    this.handleResize = () => {
      const isMobile = window.innerWidth < mediaQueries.lBreakPoint
      this.setState({
        isMobile
      })
    }

    this.measure = () => {
      if (this.sectionRef) {
        const { width, height } = this.sectionRef.getBoundingClientRect()
        const offset = this.sectionRef.offsetTop
        return {
          width,
          height,
          offset
        }
      } else {
        return {
          width: 0,
          height: 0,
          offset: 0
        }
      }
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
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
        {
          children
        }
      </section>
    )
  }
}

StickySection.propTypes = {
  spaceAfter: PropTypes.bool,
  label: PropTypes.string.isRequired
}

StickySection.defaultProps = {
  spaceAfter: true
}

export default StickySection
