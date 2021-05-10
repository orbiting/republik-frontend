import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { Router } from '../../lib/routes'
import { scrollTop } from '../../lib/utils/link'

const hasAncestor = (node, predicate) => {
  if (predicate(node)) {
    return true
  }
  if (node.parentNode) {
    return hasAncestor(node.parentNode, predicate)
  }
  return false
}

class AreaLink extends Component {
  constructor(props, ...rest) {
    super(props, ...rest)
    this.linkClicked = this.linkClicked.bind(this)
  }
  linkClicked(e) {
    if (hasAncestor(e.target, node => node.nodeName === 'A')) {
      // ignore click for specific links
      // the area link links areas that are not part of an A tag
      return
    }

    const { route, params, replace, scroll } = this.props
    const changeMethod = replace ? 'replace' : 'push'

    Router[changeMethod](route, params)
      .then(success => {
        if (!success) return
        if (scroll) {
          scrollTop()
          document.body.focus()
        }
      })
      .catch(err => {
        if (this.props.onError) this.props.onError(err)
      })
  }
  render() {
    const { children, passHref } = this.props
    const child = Children.only(children)
    if (passHref) {
      throw new Error('Area links never pass href')
    }

    const props = {
      onClick: this.linkClicked
    }

    return React.cloneElement(child, props)
  }
}

AreaLink.propTypes = {
  children: PropTypes.element.isRequired,
  route: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  scroll: PropTypes.bool.isRequired,
  replace: PropTypes.bool.isRequired
}

AreaLink.defaultProps = {
  scroll: true,
  replace: false
}

export default AreaLink
