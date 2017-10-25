import React, {Component} from 'react'
import { compose } from 'redux'
import Frame from '../components/Frame'
import Nav from '../components/Nav'
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

    return (
      <Frame url={url} nav={<Nav route='community' url={url} />}>
        <List url={url} seed={seed} isPage />
      </Frame>
    )
  }
}

export default compose(withData)(CommunityPage)
