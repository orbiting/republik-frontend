import React, { useState, useEffect } from 'react'
import { compose, graphql } from 'react-apollo'
import { possibleSubscriptions } from './enhancers'
import { TeaserSectionTitle, plainButtonRule, A } from '@project-r/styleguide'
import { css } from 'glamor'
import SubscribeDocumentCheckbox from './SubscribeDocumentCheckbox'
import withT from '../../lib/withT'
import { ONBOARDING_SECTIONS_REPO_IDS } from '../../lib/constants'

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
      <SubscribeDocumentCheckbox subscription={format.subscribedByMe} key={i} />
    ))}
  </div>
)

const getSubscriptionCount = section =>
  section.formats.nodes.filter(f => f.subscribedByMe.active).length

const SubscribeDocuments = ({ t, data: { sections } }) => {
  const [showAll, setShowAll] = useState(false)
  const [sectionsWithFormat, setSectionsWithFormat] = useState([])
  const [shownSections, setShownSections] = useState([])
  const [totalSubs, setTotalSubs] = useState(0)

  useEffect(() => {
    if (!sections || !sections.nodes) return
    setSectionsWithFormat(
      sections.nodes.filter(s => s.formats.nodes.length > 0)
    )
  }, [sections])

  useEffect(() => {
    setTotalSubs(
      sectionsWithFormat.reduce(
        (reducer, section) => reducer + getSubscriptionCount(section),
        0
      )
    )
    setShownSections(
      sectionsWithFormat.filter(
        section =>
          shownSections.find(s => s.id === section.id) ||
          getSubscriptionCount(section) ||
          SECTIONS_ALWAYS_SHOWN.find(repoId => repoId === section.repoId)
      )
    )
  }, [sectionsWithFormat])

  if (!sectionsWithFormat.length) return null

  return (
    <>
      <div style={{ marginTop: 20 }}>
        <p>
          {t.pluralize('Notifications/settings/formats/summary', {
            count: totalSubs
          })}
        </p>
      </div>
      {(showAll ? sectionsWithFormat : shownSections).map(section => (
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
      <button {...plainButtonRule} onClick={() => setShowAll(!showAll)}>
        <A>
          {t(`Notifications/settings/formats/${showAll ? 'hide' : 'show'}`)}
        </A>
      </button>
    </>
  )
}

export default compose(
  withT,
  graphql(possibleSubscriptions)
)(SubscribeDocuments)
