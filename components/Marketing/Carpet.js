import React, { useState, useEffect } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import {
  Loader,
  mediaQueries,
  Editorial,
  Center,
  Button
} from '@project-r/styleguide'

import TeaserBlock, { GAP as TEASER_BLOCK_GAP } from '../Overview/TeaserBlock'
import { getTeasersFromDocument } from '../Overview/utils'
const query = gql`
  query MarketingPage {
    front: document(path: "/") {
      id
      children(first: 60) {
        nodes {
          body
        }
      }
    }
  }
`

const Carpet = ({ t, data: { loading, front } }) => {
  const [highlight, setHighlight] = useState()
  const [isMobile, setIsMobile] = useState()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < mediaQueries.mBreakPoint)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  console.log(isMobile)

  // ensure the highlighFunction is not dedected as an state update function
  const onHighlight = highlighFunction => setHighlight(() => highlighFunction)
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 50,
          zIndex: 2,
          width: '100%',
          height: 100,
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0))'
        }}
      />
      <Loader
        loading={loading}
        style={{ minHeight: 300 }}
        render={() => (
          <TeaserBlock
            teasers={getTeasersFromDocument(front)}
            highlight={highlight}
            onHighlight={onHighlight}
            maxHeight={isMobile ? 300 : 600}
            maxColumns={6}
            noHover
          />
        )}
      />
      <Center>
        <div {...styles.center}>
          <Editorial.P>{t('marketing/page/carpet/text')}</Editorial.P>
          <Button primary>{t('marketing/page/carpet/button')}</Button>
        </div>
      </Center>
    </div>
  )
}

const styles = {
  center: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '2em'
  })
}

export default compose(graphql(query))(Carpet)
