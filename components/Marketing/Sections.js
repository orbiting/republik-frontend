import React from 'react'
import { css } from 'glamor'

import {
  fontStyles,
  Meta,
  useColorContext,
  mediaQueries,
  FigureImage
} from '@project-r/styleguide'
import SectionTitle from './Common/SectionTitle'
import SectionContainer from './Common/SectionContainer'
import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'
import Link from 'next/link'

const sectionContent = [
  {
    title: 'Briefing',
    href: '/briefings',
    image: '/static/marketing/briefings.png?size=2000x2000',
    color: '#0A99B8',
    description: (
      <>
        Durch die Woche mit der Republik: Das Datenbriefing «Auf lange Sicht» am
        Montag, das Justiz-Briefing «Am Gericht» am Mittwoch, das «Briefing aus
        Bern» am Donnerstag und «Was diese Woche wichtig war» am Freitag.
      </>
    )
  },
  {
    title: 'Kolumnen',
    href: '/kolumnen',
    image: '/static/marketing/kolumnen.png?size=2000x2000',
    imageDark: '/static/marketing/kolumnen-dark.png?size=2000x2000',
    color: '#D2933C',
    description: (
      <>
        Die Köpfe der Republik: Immer wieder dienstags eine Kolumne von Mely
        Kiyak oder Daniel Strassberg, jeden Samstag von Daniel Binswanger. Und
        immer dann, wenn sie da ist, von Constantin Seibt. Ausserdem jeden
        Samstag: die Fotokolumne «Blickwechsel».
      </>
    )
  },
  {
    title: 'Covid-19-Uhr-Newsletter',
    href: '/format/covid-19-uhr-newsletter',
    image: '/static/marketing/covid.png?size=2000x2000',
    color: '#d44438',
    description: (
      <>
        Brauchbares zur Pandemie – immer wenn es dunkel wird. Informationen für
        alle. 180 Ausgaben lang.
      </>
    )
  },
  {
    title: 'Audio',
    href: '/audio',
    image: '/static/marketing/audio.png?size=2000x2000',
    color: '#000000',
    description: (
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
            <Link href={section.href} passHref>
              <a {...styles.link}>
                <FigureImage
                  {...FigureImage.utils.getResizedSrcs(
                    `${CDN_FRONTEND_BASE_URL}${section.image}`,
                    80
                  )}
                  dark={
                    section.imageDark &&
                    FigureImage.utils.getResizedSrcs(
                      `${CDN_FRONTEND_BASE_URL}${section.imageDark}`,
                      80
                    )
                  }
                />
              </a>
            </Link>
          </div>
          <div {...styles.description}>
            <Meta.Subhead
              style={{ marginTop: 0 }}
              {...colorScheme.set('color', section.color, 'format')}
            >
              <Link href={section.href} passHref>
                <a {...styles.link}>{section.title}</a>
              </Link>
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
    marginRight: 16,
    objectFit: 'cover',
    [mediaQueries.mUp]: {
      marginRight: 36
    }
  }),
  title: css({
    ...fontStyles.sansSerifRegular22
  }),
  link: css({
    color: 'inherit',
    textDecoration: 'none'
  }),
  descriptionText: {
    ...fontStyles.sansSerifRegular18
  }
}

export default Sections
