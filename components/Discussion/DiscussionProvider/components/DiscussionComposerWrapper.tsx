import React, { ReactElement, ReactNode, useMemo } from 'react'
import { useDiscussion } from '../context/DiscussionContext'
import { useInNativeApp } from '../../../../lib/withInNativeApp'
import { useMe } from '../../../../lib/context/MeContext'
import Box from '../../../Frame/Box'
import {
  Editorial,
  Interaction,
  timeahead,
  useCurrentMinute
} from '@project-r/styleguide'
import Link from 'next/link'
import { useTranslation } from '../../../../lib/withT'

type Props = {
  children: ReactNode
  isTopLevel?: boolean
  showPayNotes?: boolean
}

/**
 * Handle rendering of a DiscussionComposer
 * @param children
 * @param isTopLevel
 * @param showPayNotes
 * @constructor
 */
const DiscussionComposerWrapper = ({
  children,
  isTopLevel,
  showPayNotes
}: Props): ReactElement => {
  const { inNativeIOSApp } = useInNativeApp()
  const { discussion } = useDiscussion()
  const { me } = useMe()
  const { t } = useTranslation()

  const now = useCurrentMinute()
  function timeAheadFromNow(dateString) {
    return timeahead(t, (now - Date.parse(dateString)) / 1000)
  }

  const isHiddenTopLevelComposer = useMemo(() => {
    return isTopLevel && !!discussion?.rules?.disableTopLevelComments
  }, [discussion, isTopLevel])

  const hidePayNote = useMemo(() => {
    return !showPayNotes || inNativeIOSApp
  }, [showPayNotes, inNativeIOSApp])

  if (!discussion || isHiddenTopLevelComposer) {
    return null
  }

  if (!me || !discussion?.userCanComment) {
    if (hidePayNote) {
      return null
    }

    return (
      <Box style={{ padding: '15px 20px' }}>
        <Interaction.P>
          {t.elements(
            'submitComment/notEligible',
            {
              pledgeLink: (
                <Link href='/angebote' key='pledge' passHref>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <Editorial.A>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    {t('submitComment/notEligible/pledgeText')}
                  </Editorial.A>
                </Link>
              )
            },
            ''
          )}
        </Interaction.P>
      </Box>
    )
  }

  if (discussion.closed) {
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    /* @ts-ignore */
    return <Box style={{ padding: '15px 20px' }}>{t('discussion/closed')}</Box>
  }

  const waitUntilDate =
    discussion.userWaitUntil && new Date(discussion.userWaitUntil)

  if (waitUntilDate && waitUntilDate > new Date()) {
    return (
      <Box style={{ padding: '15px 20px' }}>
        <Interaction.P>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          {t('styleguide/CommentComposer/wait', {
            time: timeAheadFromNow(waitUntilDate)
          })}
        </Interaction.P>
      </Box>
    )
  }

  return <>{children}</>
}

export default DiscussionComposerWrapper
