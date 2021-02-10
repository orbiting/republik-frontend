import React from 'react'
import { css } from 'glamor'

import {
  fontStyles,
  Meta,
  useColorContext,
  mediaQueries,
  A,
  FigureImage
} from '@project-r/styleguide'
import SectionTitle from './Common/SectionTitle'
import SectionContainer from './Common/SectionContainer'
import { Link } from '../../lib/routes'
import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'

const sectionContent = [
  {
    title: 'Covid-19-Uhr-Newsletter',
    image: '/static/marketing/covid.png?size=80x80',
    color: '#000000',
    Description: () => (
      <>
        Brauchbares zur Pandemie – immer wenn es dunkel wird. Informationen für
        alle. Auch ohne Mitgliedschaft oder Abo.{' '}
        <Link route='/format/covid-19-uhr-newsletter' passHref>
          <A>Hier gratis abonnieren.</A>
        </Link>
      </>
    )
  },
  {
    title: 'Briefing',
    image: '/static/marketing/briefings.png?size=80x80',
    color: '#0A99B8',
    Description: () => (
      <>
        Durch die Woche mit der Republik: Das Datenbriefing «Auf lange Sicht» am
        Montag, das Justiz-Briefing «Am Gericht» am Mittwoch, das «Briefing aus
        Bern» am Donnerstag und «Was diese Woche wichtig war» am Freitag.
      </>
    )
  },
  {
    title: 'Kolumnen',
    image: '/static/marketing/kolumnen.png?size=80x80',
    imageDark: '/static/marketing/kolumnen-dark.png?size=80x80',
    color: '#D2933C',
    Description: () => (
      <>
        Die Köpfe der Republik: Immer wieder dienstags eine Kolumne von Mely
        Kiyak oder Daniel Strassberg, jeden Samstag von Daniel Binswanger. Und
        immer dann, wenn sie da ist, von Constantin Seibt. Ausserdem jeden
        Samstag: die Fotokolumne «Blickwechsel».
      </>
    )
  },
  {
    title: 'Audio',
    image: '/static/marketing/audio.png?size=80x80',
    color: '#000000',
    Description: () => (
      <>
        Wenn Sie gerade keine Hand frei haben – hier finden Sie Journalismus
        fürs Ohr: Diskussionen, Podcasts, Audio-Serien. Und vorgelesene
        Geschichten.
      </>
    )
  }
]

const Sections = ({ t }) => {
  const [colorScheme] = useColorContext()
  return (
    <SectionContainer maxWidth={720}>
      <SectionTitle
        title={t('marketing/page/sections/title')}
        lead={t('marketing/page/sections/lead')}
      />
      {sectionContent.map(section => (
        <div
          key={section.title}
          {...styles.section}
          {...colorScheme.set('borderColor', 'divider')}
        >
          <div {...styles.picture}>
            <FigureImage
              src={`${CDN_FRONTEND_BASE_URL}${section.image}`}
              dark={
                section.imageDark &&
                `${CDN_FRONTEND_BASE_URL}${section.imageDark}`
              }
              alt=''
            />
          </div>
          <div {...styles.description}>
            <Meta.Subhead
              style={{ marginTop: 0 }}
              {...colorScheme.set('color', section.color, 'format')}
            >
              {section.title}
            </Meta.Subhead>
            <Meta.P>
              <section.Description />
            </Meta.P>
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
    marginRight: 16,
    objectFit: 'cover',
    [mediaQueries.mUp]: {
      marginRight: 36
    }
  }),
  title: css({
    ...fontStyles.sansSerifRegular22
  }),
  descriptionText: {
    ...fontStyles.sansSerifRegular18
  }
}

export default Sections
