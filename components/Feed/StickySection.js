import { Component } from 'react'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { css } from 'glamor'
import { colors, mediaQueries } from '@project-r/styleguide'
import PropTypes from 'prop-types'
import withInNativeApp from '../../lib/withInNativeApp'

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
    backgroundColor: '#fff'
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
      isMedium: false,
      isSmall: false,
      width: 0,
      height: 0
    }
    this.sectionRef = null
    this.setSectionRef = (el) => { this.sectionRef = el }

    this.onScroll = () => {
      if (this.sectionRef) {
        const { sticky, isSmall, height } = this.state
        const { hasSpaceAfter, inNativeApp } = this.props

        const headerHeight = isSmall
          ? HEADER_HEIGHT_MOBILE
          : HEADER_HEIGHT

        const y = window.pageYOffset + (inNativeApp
          ? 0
          : headerHeight
        )

        const offset = this.sectionRef.offsetTop
        const nextSticky = (y > offset) && // scroll pos is below top of section
          (offset + height + (hasSpaceAfter ? STICKY_HEADER_HEIGHT : 0) > y) // scroll pos is above bottom
        if (sticky !== nextSticky) {
          this.setState({ sticky: nextSticky })
        }
      }
    }

    this.measure = () => {
      const isMedium = window.innerWidth < mediaQueries.lBreakPoint
      const isSmall = window.innerWidth < mediaQueries.mBreakPoint
      if (this.sectionRef) {
        const { width, height } = this.sectionRef.getBoundingClientRect()
        this.setState({ width, height, isMedium, isSmall })
      }
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
    this.measure()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }

  render () {
    const { children, label, inNativeApp } = this.props
    const { sticky, width, isMedium } = this.state

    return (
      <section ref={this.setSectionRef}>
        <div {...style.header}>
          <div
            {...style.label}
            {...(sticky ? style.sticky : undefined)}
            style={{
              top: inNativeApp && sticky && -1,
              position: sticky ? 'fixed' : 'relative',
              width: isMedium ? width : (width ? SIDEBAR_WIDTH : '100%')
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
  hasSpaceAfter: PropTypes.bool,
  label: PropTypes.string.isRequired
}

StickySection.defaultProps = {
  hasSpaceAfter: true
}

export default withInNativeApp(StickySection)
