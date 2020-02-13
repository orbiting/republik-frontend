import React from 'react'
import { Center, TeaserNotification } from '@project-r/styleguide'
import Notification from './Notification'
import { css } from 'glamor'

const styles = {
  separator: css({
    margin: '-1rem 0 0'
  }),
  container: css({}),
  info: css({
    position: 'absolute'
  })
}

const Separator = () => (
  <div {...styles.container}>
    <hr {...styles.separator} />
  </div>
)

const Notifications = () => (
  <Center>
    <Notification />
    <TeaserNotification
      title='Der Feind in meinem Feed'
      notification='<b>Neuer Beitrag</b> von Brigitte Hürlimann'
      createdDate='2020-02-13T13:17:08.643Z'
      type='Editorial'
      source={{
        color: '#00B4FF',
        name: 'Am Gericht',
        href: 'https://www.republik.ch/format/am-gericht',
        icon:
          'https://cdn.repub.ch/s3/republik-assets/github/republik/magazine/images/79c882cf521b13dc4ae13e5447cef30fac429b87.png.webp?size=1181x1181&resize=450x'
      }}
      href='https://www.republik.ch/2020/02/12/der-feind-in-meinem-feed'
    />
    <Notification />
    <Separator />
    <Notification />
    <Notification />
    <Notification />
    <Notification />
    <Notification />
    <Notification />
    <Notification />
  </Center>
)

export default Notifications
