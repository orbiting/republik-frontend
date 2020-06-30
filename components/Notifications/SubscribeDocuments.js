import React, { useState, useEffect } from 'react'
import { compose, graphql } from 'react-apollo'
import { possibleSubscriptions } from './enhancers'
import {
  TeaserSectionTitle,
  plainButtonRule,
  A,
  Interaction
} from '@project-r/styleguide'
import { css } from 'glamor'
import SubscribeCheckbox from './SubscribeCheckbox'
import withT from '../../lib/withT'
import { ONBOARDING_SECTIONS_REPO_IDS } from '../../lib/constants'
import { withMembership } from '../Auth/checkRoles'
import Box from '../Frame/Box'

const styles = {
  checkboxes: css({
    margin: '20px 0'
  })
}

const SECTIONS_ALWAYS_SHOWN = ONBOARDING_SECTIONS_REPO_IDS
  ? ONBOARDING_SECTIONS_REPO_IDS.split(',')
  : []

const FormatCheckboxes = ({ formats }) => (
  <div {...styles.checkboxes}>
    {formats.map((format, i) => (
      <SubscribeCheckbox subscription={format.subscribedByMe} key={i} />
    ))}
  </div>
)

const getSubscriptionCount = section =>
  section.formats.nodes.filter(f => f.subscribedByMe.active).length

const getVisibleSections = (sections, prevShown = []) =>
  sections.filter(
    section =>
      prevShown.find(s => s.id === section.id) ||
      getSubscriptionCount(section) ||
      SECTIONS_ALWAYS_SHOWN.find(repoId => repoId === section.repoId)
  )

const SubscribeDocuments = ({ t, data: { sections }, isMember }) => {
  const [showAll, setShowAll] = useState(false)

  const sectionNodes = sections && sections.nodes
  const sectionsWithFormat = React.useMemo(() => {
    return sectionNodes
      ? sectionNodes.filter(s => s.formats.nodes.length > 0)
      : []
  }, [sectionNodes])

  const [visibleSections, setVisibleSections] = useState(
    getVisibleSections(sectionsWithFormat || [])
  )

  useEffect(() => {
    setVisibleSections(prevShown =>
      getVisibleSections(sectionsWithFormat, prevShown)
    )
  }, [sectionsWithFormat])

  const totalSubs =
    sectionsWithFormat &&
    sectionsWithFormat.reduce(
      (reducer, section) => reducer + getSubscriptionCount(section),
      0
    )

  if (!sectionsWithFormat || !sectionsWithFormat.length) return null

  return (
    <>
      {!isMember && (
        <Box style={{ margin: '10px 0', padding: 15 }}>
          <Interaction.P>
            {t('Notifications/settings/formats/noMembership')}
          </Interaction.P>
        </Box>
      )}
      <Interaction.P style={{ marginBottom: 10 }}>
        {t.pluralize('Notifications/settings/formats/summary', {
          count: totalSubs
        })}
      </Interaction.P>
      {(showAll ? sectionsWithFormat : visibleSections).map(section => (
        <div key={section.id}>
          <div
            style={{
              color: '#979797'
            }}
          >
            <TeaserSectionTitle small>{section.meta.title}</TeaserSectionTitle>
          </div>
          <FormatCheckboxes formats={section.formats.nodes} />
        </div>
      ))}
      {sectionsWithFormat.length !== visibleSections.length && (
        <button
          {...plainButtonRule}
          onClick={() => {
            setVisibleSections(getVisibleSections(sectionsWithFormat))
            setShowAll(!showAll)
          }}
        >
          <A>
            {t(`Notifications/settings/formats/${showAll ? 'hide' : 'show'}`)}
          </A>
        </button>
      )}
    </>
  )
}

export default compose(
  withT,
  withMembership,
  graphql(possibleSubscriptions)
)(SubscribeDocuments)
