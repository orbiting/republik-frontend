import React from 'react'
import { css } from 'glamor'

import { fontStyles, Meta, useColorContext } from '@project-r/styleguide'
import SectionTitle from './Common/SectionTitle'
import SectionContainer from './Common/SectionContainer'

const Sections = ({ t }) => {
  const [colorScheme] = useColorContext()
  const sections = [
    {
      name: 'Formate',
      color: '#d44438',
      description:
        'Updates zur Aktualität, Watchblogs, Glossen, der literarische «Salon Der Republik» und alles, was in der Republik sonst noch regelmässig unregelmässig erscheint.',
      imageURL: '/'
    },
    {
      name: 'Briefings',
      color: '#07809B',
      description:
        'Durch die Woche mit der Republik: das Datenbriefing «Auf lange Sicht» am Montag, das Justizbriefing «Am Gericht» am Mittwoch, das «Briefing aus Bern» am Donnerstag und «Was diese Woche wichtig war» am Freitag.',
      imageURL: '/'
    },
    {
      name: 'Kolumnen',
      color: '#D3933C',
      description:
        'Die Köpfe der Republik: Immer wieder dienstags eine Kolumne von Mely Kiyak, Daniel Strassberg oder Sibylle Berg, jeden Samstag von Daniel Binswanger. Und immer dann, wenn sie da ist, von Constantin Seibt. Ausserdem jeden Samstag: die Fotokolumne «Blickwechsel».',
      imageURL: '/'
    },
    {
      name: 'Audio',
      color: '#000000',
      description:
        'Wenn Sie gerade keine Hand frei haben – hier finden Sie Journalismus fürs Ohr: Diskussionen, Podcasts, Audio-Serien. Und vorgelesene Geschichten.',
      imageURL: '/'
    }
  ]
  return (
    <SectionContainer>
      <SectionTitle
        title='Unsere Rubriken'
        lead='Recherchen, Fakten, Zusammenhänge. Kein Klickbait oder bezahlte
        Beiträge.'
      />
      {sections.map(section => (
        <div
          key={section.name}
          {...styles.section}
          {...colorScheme.set('borderColor', 'divider')}
        >
          <img {...styles.picture} src={section.imageURL} alt='' />
          <div {...styles.description}>
            <Meta.Subhead
              style={{ marginTop: 0 }}
              {...colorScheme.set('color', section.color, 'format')}
            >
              {section.name}
            </Meta.Subhead>
            <Meta.P>{section.description}</Meta.P>
          </div>
        </div>
      ))}
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
    marginRight: 48
  }),
  title: css({
    ...fontStyles.sansSerifRegular22
  }),
  descriptionText: {
    ...fontStyles.sansSerifRegular18
  }
}

export default Sections
