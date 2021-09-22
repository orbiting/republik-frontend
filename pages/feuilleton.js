import React from 'react'
import compose from 'lodash/flowRight'
import { withRouter } from 'next/router'

import Box from '../components/Frame/Box'
import Frame from '../components/Frame'
import Front from '../components/Front'
import withInNativeApp from '../lib/withInNativeApp'
import withT from '../lib/withT'
import withMembership, {
  UnauthorizedPage
} from '../components/Auth/withMembership'

import { Interaction, Loader, RawHtml } from '@project-r/styleguide'

import withDefaultSSR from '../lib/hocs/withDefaultSSR'

const FeuilletonPage = props => {
  const { t, me, router, isMember, inNativeIOSApp, serverContext } = props
  console.debug(props)

  if (isMember) {
    // does it's own meta
    return (
      <Front
        extractId={router.query.extractId}
        renderBefore={() => {
          return (
            <Box style={{ padding: 14, textAlign: 'center' }}>
              <Interaction.P>
                <RawHtml
                  dangerouslySetInnerHTML={{
                    __html: t('feuilleton/deprecatedPage')
                  }}
                />
              </Interaction.P>
            </Box>
          )
        }}
        {...props}
      />
    )
  }
  if (inNativeIOSApp) {
    return <UnauthorizedPage me={me} />
  }
  if (serverContext) {
    serverContext.res.redirect(302, '/')
    serverContext.res.end()
  } else {
    router.replace('/')
  }

  return (
    <Frame>
      <Loader />
    </Frame>
  )
}

export default withDefaultSSR(
  compose(withMembership, withInNativeApp, withRouter, withT)(FeuilletonPage)
)
