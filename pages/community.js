import React, {Component} from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import List, {generateSeed} from '../components/Testimonial/List'
import Share from '../components/Testimonial/Share'
import TV from '../components/Testimonial/TV'
import Image from '../components/Testimonial/Image'

import withData from '../lib/apollo/withData'

class CommunityPage extends Component {
  static async getInitialProps (ctx) {
    return {
      seed: generateSeed()
    }
  }
  render () {
    const {url, seed} = this.props

    if (url.query.share) {
      return <Share focus={url.query.share} first={1} />
    }

    if (url.query.tv) {
      return <TV
        duration={+Math.max(1000, url.query.duration || 30000)} />
    }

    if (url.query.img) {
      const order = url.query.order || 'ASC'
      const defaultSequenceNumber = order === 'DESC' ? Math.pow(10, 6) : 0
      return <Image query={url.query}
        sequenceNumber={url.query.sequenceNumber || defaultSequenceNumber}
        orderDirection={order}
        duration={+Math.max(1000, url.query.duration || 5000)} />
    }

    return (
      <Frame url={url}>
        <List url={url} seed={seed} isPage />
      </Frame>
    )
  }
}

export default compose(withData)(CommunityPage)

/*
import React, {Component} from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import List, {generateSeed} from '../components/Testimonial/List'
import withData from '../lib/apollo/withData'

class CommunityPage extends Component {
  static async getInitialProps (ctx) {
    return {
      seed: generateSeed()
    }
  }
  render () {
    const {url, seed} = this.props
    if (url.query.share) {
      return <Share firstId={url.query.share} />
    }
    if (url.query.tv) {
      return <TV
        duration={+Math.max(1000, url.query.duration || 30000)} />
    }
    if (url.query.img) {
      const order = url.query.order || 'ASC'
      const defaultSequenceNumber = order === 'DESC' ? Math.pow(10, 6) : 0
      return <Image query={url.query}
        sequenceNumber={url.query.sequenceNumber || defaultSequenceNumber}
        orderDirection={order}
        duration={+Math.max(1000, url.query.duration || 5000)} />
    }
    return (
      <Frame url={url}>
        <List url={url} seed={seed} isPage />
      </Frame>
    )
  }
}

export default compose(withData)(CommunityPage)

 */
