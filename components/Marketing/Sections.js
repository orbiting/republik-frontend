import React from 'react'
import { css } from 'glamor'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import {
  fontStyles,
  Meta,
  useColorContext,
  Loader,
  mediaQueries
} from '@project-r/styleguide'
import SectionTitle from './Common/SectionTitle'
import SectionContainer from './Common/SectionContainer'

const Sections = ({
  t,
  data: { loading, covid19, briefings, columns, audio }
}) => {
  const [colorScheme] = useColorContext()
  const sections = [covid19, briefings, columns, audio]
  return (
    <SectionContainer maxWidth={720}>
      <SectionTitle
        title={t('marketing/page/sections/title')}
        lead={t('marketing/page/sections/lead')}
      />
      <Loader
        loading={loading}
        style={{ minHeight: 400 }}
        render={() => (
          <>
            {sections.filter(Boolean).map(section => (
              <div
                key={section.meta.title}
                {...styles.section}
                {...colorScheme.set('borderColor', 'divider')}
              >
                <img {...styles.picture} src={section.meta.image} alt='' />
                <div {...styles.description}>
                  <Meta.Subhead
                    style={{ marginTop: 0 }}
                    {...colorScheme.set('color', section.meta.color, 'format')}
                  >
                    {section.meta.title}
                  </Meta.Subhead>
                  <Meta.P>{section.meta.description}</Meta.P>
                </div>
              </div>
            ))}
          </>
        )}
      />
    </SectionContainer>
  )
}

const styles = {
  section: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'top',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    paddingTop: 28,
    marginBottom: 32
  }),
  description: css({
    flex: 1
  }),
  picture: css({
    width: 80,
    height: 80,
    marginRight: 24,
    objectFit: 'cover',
    [mediaQueries.mUp]: {
      marginRight: 48
    }
  }),
  title: css({
    ...fontStyles.sansSerifRegular22
  }),
  descriptionText: {
    ...fontStyles.sansSerifRegular18
  }
}

const query = gql`
  query sections {
    covid19: document(path: "/format/covid-19-uhr-newsletter") {
      meta {
        title
        description
        image
      }
    }
    briefings: document(path: "/briefings") {
      meta {
        title
        description
        image
        color
      }
    }
    columns: document(path: "/kolumnen") {
      meta {
        title
        description
        image
        color
      }
    }
    audio: document(path: "/audio") {
      meta {
        title
        description
        image
        color
      }
    }
  }
`

export default compose(graphql(query))(Sections)
