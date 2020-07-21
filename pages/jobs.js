import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import { css } from 'glamor'

import { Editorial, Interaction, A, mediaQueries } from '@project-r/styleguide'

import withT from '../lib/withT'

import Frame, { MainContainer, Content } from '../components/Frame'
import ImageCover from '../components/ImageCover'

import { PUBLIC_BASE_URL } from '../lib/constants'

import { HEADER_HEIGHT_MOBILE, HEADER_HEIGHT } from '../components/constants'

const { P, LI } = Editorial
const { H1 } = Interaction

const H2 = ({ children }) => (
  <Interaction.H2 style={{ marginBottom: 15 }}>{children}</Interaction.H2>
)
const H3 = ({ children }) => (
  <Interaction.H3 style={{ marginBottom: -20 }}>{children}</Interaction.H3>
)

const styles = {
  anchor: css({
    display: 'block',
    visibility: 'hidden',
    position: 'relative',
    top: -(HEADER_HEIGHT_MOBILE + 20),
    [mediaQueries.mUp]: {
      top: -(HEADER_HEIGHT + 20)
    }
  })
}

const Anchor = ({ children, id }) => {
  return (
    <div>
      <a {...styles.anchor} id={id} />
      {children}
    </div>
  )
}

export default compose(
  withT,
  withRouter
)(({ router, t }) => {
  const meta = {
    pageTitle: t('jobs/pageTitle'),
    title: t('jobs/title'),
    description: t('jobs/description'),
    image:
      'https://cdn.republik.space/s3/republik-assets/assets/images/jobs2.jpg?resize=2000x',
    url: `${PUBLIC_BASE_URL}${router.pathname}`
  }

  return (
    <Frame meta={meta} raw>
      <ImageCover
        image={{
          src: meta.image,
          alt:
            'Weitwinkelfoto von vielen Republik-Mitarbeitern und Freunden mit brennender Geburtstagstorte in Mitte.'
        }}
      />
      <MainContainer>
        <Content>
          <P>
            Die Republik ist ein täglich erscheinendes digitales, werbefreies
            Magazin für Politik, Wirtschaft, Gesellschaft und Kultur. Wir sind
            getrieben von unserem Willen, eine gewichtige unabhängige Stimme in
            der Schweizer Medienlandschaft zu sein. Werde Teil einer{' '}
            <A href='/impressum'>
              interdisziplinären und leidenschaftlichen Crew
            </A>
            .
          </P>

          <H1>Offene Stellen</H1>
          <Editorial.UL>
            <LI>
              <A href='#community'>Community-Redaktorin (60%)</A>
            </LI>
            <LI>
              <A href='#it'>Backend-Entwicklerin (60-100%)</A>
            </LI>
          </Editorial.UL>
          <br />
          <br />

          <Anchor id='community'>
            <H2>Wir suchen eine Community-Redaktorin (60%)</H2>
          </Anchor>
          <P>
            Dein journalistischer Beat ist die Republik. Du bist als Teil des
            Community+-Teams zuständig für die journalistische Berichterstattung
            in eigener Sache: vom Social-Media-Post bis zur Begleitung von
            Veranstaltungen. Dazu nimmst du an den Redaktionssitzungen teil –
            und bist im engen Austausch mit der Chefredaktion.
          </P>

          <H3>Deine wichtigsten Aufgaben:</H3>
          <br />
          <Editorial.UL>
            <LI>
              Schreiben, Redigieren und Organisieren von{' '}
              <strong>
                <A href='https://www.republik.ch/zur-lage-der-republik'>
                  Metaberichterstattung über die Republik
                </A>
              </strong>{' '}
              («Aus der Redaktion», «Echo auf die Republik» und «An die
              Verlagsetage»);
            </LI>
            <LI>
              <strong>Vermarktung von Beiträgen</strong> (Verfassen von
              Auftaktseiten für Serien, Texten von und Mitarbeit bei
              Teaser-Videos, Texten/Redigieren von Social-Media-Posts);
            </LI>
            <LI>
              <strong>
                Dialog mit der Verlegerschaft und der breiteren Community
              </strong>{' '}
              (Erstellen, Organisieren, journalistisches Auf- und Nachbereiten
              von Leserdebatten und Veranstaltungen);
            </LI>
            <LI>
              <strong>Moderieren und Mitdiskutieren</strong> im Republik-Dialog;
            </LI>
            <LI>
              <strong>Mitarbeit an den Newslettern</strong> (Tages-, Wochen- und
              Project-R-Newsletter);
            </LI>
            <LI>
              Mitarbeit beim <strong>Social-Media-Management</strong>.
            </LI>
          </Editorial.UL>

          <P>
            Du hast erste journalistische Erfahrungen und bist sehr textsicher.
            Du arbeitest gerne selbstständig und vernetzt – für und mit allen
            Teams im Haus. Du brennst dafür, dass möglichst viele Menschen von
            unserem Journalismus erfahren. Du interessierst dich für den
            Journalismus genauso wie für die Community, die ihn unterstützt, und
            das Community-orientierte Geschäftsmodell, das ihn erst möglich
            macht. Du möchtest neue Verlegerinnen gewinnen und die bestehenden
            begeistern – und kritisch-konstruktiv über unsere Erfolge, Debatten
            und Fuck-ups berichten.
          </P>

          <H3>Das bieten wir dir:</H3>
          <P>
            Die interessantesten Probleme der Branche. Ein motiviertes,
            multidisziplinäres und unorthodoxes Team. Viel Raum, um deine Ideen
            zu entfalten. Einen guten Einheitslohn. Ein Büro an einer der
            verruchtesten Ecken in Zürich.
          </P>

          <P>Stellenantritt per 1. September 2020 oder nach Vereinbarung.</P>

          <H3>Interesse?</H3>
          <P>
            Wir freuen uns auf deine Bewerbung an{' '}
            <A href='mailto:bewerbung@republik.ch'>bewerbung@republik.ch</A>.
            Neben einem Lebenslauf interessiert uns vor allem, was dich
            motiviert, ein Teil der Republik zu werden. Uns ist eine
            Ausgeglichenheit der Geschlechter wichtig, deshalb legen wir in
            diesem Fall einen Fokus auf Bewerberinnen.
          </P>

          <Anchor id='it'>
            <H2>Backend-Entwicklerin gesucht (60-100%)</H2>
          </Anchor>

          <P>
            Zusammen mit dem Team willst du die{' '}
            <A href='https://www.republik.ch/2020/05/04/verstaerken-sie-unsere-software-entwicklung'>
              Republik langfristig weiterentwickeln
            </A>
            . Du geniesst es, viel Freiheit zu haben, bringst dich gerne
            konzeptionell ein und interessierst dich für verschiedene Aspekte
            unseres Produktes wie beispielsweise das Mitgliedschaftsmodell, die
            internen Prozesse, den Dialog mit der Community, Umfragen oder
            Datenanalysen.
          </P>

          <P>
            Du hast Erfahrungen mit Node.js und SQL. GraphQL und PostgreSQL sind
            dir ein Begriff und du möchtest damit arbeiten. Du hilfst mit, dass
            unsere API zuverlässig und schnell läuft und bist nicht abgeneigt,
            eine Datenauswertung zu erstellen oder an einer Geschichte
            mitzuarbeiten.
          </P>

          <H3>Was wir bieten</H3>
          <br />
          <Editorial.UL>
            <LI>
              Sinnstiftende Arbeit:{' '}
              <A href='/manifest'>
                Aufklärung, Kritik der Macht und Verantwortung für
                die&nbsp;Öffentlichkeit
              </A>
            </LI>
            <LI>Teilzeit möglich</LI>
            <LI>Einheitslohn auf hohem Niveau</LI>
            <LI>Flexible Arbeitszeiten und Homeoffice</LI>
            <LI>Zentraler Arbeitsort an der Langstrasse in Zürich</LI>
          </Editorial.UL>
          <P>
            Unser <A href='https://github.com/orbiting'>Code ist Open Source</A>
            , wir haben einen{' '}
            <A href='https://styleguide.republik.ch/'>Styleguide</A> und unsere{' '}
            <A href='https://api.republik.ch/graphiql'>API ist öffentlich</A>{' '}
            zugänglich. Du wirst Teil des IT-Teams und eng mit dem
            Community-Team und Kolleginnen aus der Redaktion zusammenarbeiten.
          </P>

          <H3>Wie bewerben?</H3>
          <P style={{ marginBottom: 10 }}>
            Du bist interessiert? Dann bewirb dich:{' '}
            <A href='mailto:bewerbung@republik.ch'>bewerbung@republik.ch</A>.
          </P>
          <P>
            Deine Bewerbung sollte einen Lebenslauf und (ein Portfolio, ein
            Github-Profil oder einen Blog) beinhalten. Es ist keine formale
            Ausbildung zwingend: Wir interessieren uns für dich, ganz egal, ob
            du einen Master hast oder du dir alles selbst beigebracht hast. Das
            Wichtigste ist, dass du das beste digitale Magazin der Schweiz mit
            uns entwickeln willst.
          </P>
          <P>
            Zum Bewerbungsprozess: Entweder wir laden dich zu einem ersten
            Gespräch ein, oder du bekommst eine Absage. Falls wir uns nach
            diesem Gespräch eine Zusammenarbeit vorstellen können, laden wir
            dich für einen Kennenlerntag ein. Wir arbeiten zusammen an einem
            Feature und du lernst den Rest des Teams kennen. So haben wir alle,
            du und wir, eine möglichst gute Grundlage für den finalen Entscheid.
          </P>
          <P>Wir freuen uns auf deine Bewerbung.</P>
        </Content>
      </MainContainer>
    </Frame>
  )
})
