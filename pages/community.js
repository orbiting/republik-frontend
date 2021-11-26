import React, { Component } from 'react'
import compose from 'lodash/flowRight'
import { withRouter } from 'next/router'
import Frame from '../components/Frame'
import List, { generateSeed } from '../components/Testimonial/List'
import Share from '../components/Testimonial/Share'
import TV from '../components/Testimonial/TV'
import Image from '../components/Testimonial/Image'
import withDefaultSSR from '../lib/hocs/withDefaultSSR'

class CommunityPage extends Component {
  static async getInitialProps(ctx) {
    return {
      seed: generateSeed()
    }
  }
  render() {
    return (
      <Frame>
        <p>Bald wieder verfügbar.</p>
      </Frame>
    )
  }
}

export default withDefaultSSR(compose(withRouter)(CommunityPage))
