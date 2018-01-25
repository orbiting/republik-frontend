import React from 'react'
import withData from '../lib/apollo/withData'
import withT from '../lib/withT'

import Frame from '../components/Frame'

import { Editorial, Interaction, TitleBlock, A } from '@project-r/styleguide'

import { PUBLIC_BASE_URL, STATIC_BASE_URL } from '../lib/constants'

const { P, LI } = Editorial

export default withData(
  withT(({ url, t }) => {
    const meta = {
      pageTitle: t('researchBudget/pageTitle'),
      title: t('researchBudget/title'),
      description: t('researchBudget/description'),
      image: `${STATIC_BASE_URL}/static/team/bern.jpg`,
      url: `${PUBLIC_BASE_URL}${url.pathname}`
    }

    return (
      <Frame
        url={url}
        meta={meta}
      >

        <TitleBlock center>
          <Interaction.Headline>Der Etat für grosse Recherchen, grosse Geschichten und grosse Ideen</Interaction.Headline>
          <Editorial.Lead>
          Project R und die Republik möchten Sie einladen, Ihre besten Geschichten bei uns zu erzählen. Dank der Grosszügigkeit unserer Verlegerinnen und Verleger können wir 2018 eine Viertelmillion Franken für aussergewöhnlichen Journalismus vergeben.
        </Editorial.Lead>
        </TitleBlock>

        <P>Nun liegt es an Ihnen. Schicken Sie uns ein Exposé für eine grosse Story, harte Recherche oder wilde Idee. Eine, die das Potential hat, im Gedächtnis zu bleiben, Dinge zu ändern oder Leser und Leserinnen zu verblüffen. Eine, bei der die Wahrheit nicht gemütlich daherschlendert, sondern knallt.</P>
        <P>Wir versprechen: Ihre Idee wird vertraulich behandelt. Und sie müssen nicht warten: Wir prüfen ihren Vorschlag umgehend. Sie erhalten binnen einer Woche eine Antwort. Im schlimmsten Fall ist das ein kurzes: «Leider nein», aber dann verlieren Sie wenigstens keine Zeit.</P>
        <P>Was wir suchen? Grosse Recherche, grosse Geschichten und grosse Ideen, die mutig sind, kühn und unberechenbar. Die etwas Verborgenes enthüllen. Oder etwas Bekanntes in ein neues Licht rücken. Die aktuell sind. Die relevant sind. Die in das Herz der Gesellschaft zielen, vorzugsweise in das der Schweizer Gesellschaft.</P>
        <P>Geschichten, die uns packen, verblüffen, vielleicht sogar verändern. Uns die Augen öffnen. Die sich erzählerisch etwas trauen. Die mit Formen und Formaten spielen. Die das Potential haben zur «grossen Story». Die wir gemeinsam, Sie und wir, aufwändig produzieren, mit all unserem Können.</P>
        <P>Wir wollen möglichst genau verstehen, was Sie vorhaben. Und möchten Sie bitten, uns diese 20 Fragen zu beantworten:</P>

        <Editorial.OL>

          <LI>Was ist der Arbeitstitel Ihrer Geschichte?</LI>
          <LI>Wie lautet die Geschichte in einem Satz?</LI>
          <LI>Wie lautet der mögliche Vorspann (5 Sätze)?</LI>
          <LI>Was ist die Story in höchstens 3000 Zeichen?</LI>
          <LI>Warum ist sie relevant?</LI>
          <LI>Was ist neu?</LI>
          <LI>Gibt es (bislang unveröffentlichte) Dokumente oder Daten?</LI>
          <LI>Wer wird on the record sprechen? Zum ersten Mal?</LI>
          <LI>Was macht die Geschichte visuell interessant? Wie soll optisch erzählt werden, mittels Fotos, Grafiken, Illustrationen, Animationen, etc.?</LI>
          <LI>Wenn alles scheitert – was haben Sie auf jeden Fall?</LI>
          <LI>Was ist IHR Bezug zu diesem Thema?</LI>
          <LI>Was ist das Budget, das Sie im ersten Schritt benötigen? Bitte unterscheiden Sie in Sachkosten+Spesen und Tagessätze.</LI>
          <LI>Was ist der ideale Zeitplan?</LI>
          <LI>Welche Unterstützung, welches Knowhow erwarten Sie von uns?</LI>
          <LI>Haben Sie eine Erzählform vor Augen? Gibt es Vorbilder?</LI>
          <LI>Was ist der Stand der Arbeit?</LI>
          <LI>Ist die Geschichte in irgendeiner Form bekannt? Andernorts erschienen? Wenn ja, warum soll sie nochmal oder nochmal anders erzählt werden?</LI>
          <LI>Haben Sie die Geschichte anderen Medien angeboten?</LI>
          <LI>Wer sind Sie? Wer sind Ihre Mitstreiter? Haben Sie Interessenbindungen, die Sie offenlegen sollten?</LI>
          <LI>Was ist Ihr gelungenstes Projekt, und warum?</LI>

        </Editorial.OL>

        <P>Mailen Sie uns Ihr Exposé mit den Antworten auf all diese Fragen – so kurz wie möglich – zusammen mit Ihren Kontaktangaben an <A href='mailto:recherchen@republik.ch'>recherchen@republik.ch</A>.</P>

        <Editorial.Subhead>Einige Spielregeln</Editorial.Subhead>

        <P>Bitte verstehen Sie, dass wir das Geld aus dem Fonds für grosse Recherchen, Geschichten, Ideen möglichst effizient einsetzen wollen. Darum gibt es gestaffelte Budgets. Das Budget für die erste Etappe beträgt bis zu CHF 5000. Danach entscheiden wir gemeinsam, wie es weitergeht. Ist die Story fertig und geht sie in die Produktion? Ist weiterer Recherche-Aufwand nötig? Oder macht man sie mit weit mehr Ressourcen richtig gross? Was können wir von Republik an Knowhow und Technik beisteuern?</P>
        <P>Die Republik verwertet die Story auf all ihren Medienkanälen vier Wochen lang exklusiv. Danach gehen die Nutzungsrechte zurück an die Urheber. Sie dürfen dann gern weiter recherchieren, schreiben, verwerten. Egal, wo die Geschichte eines Tages erscheint, sie muss das Label tragen: «Finanziert aus dem Fonds für grosse Recherchen, Geschichten und Ideen von Project R».</P>
        <P>Wenn Sie am Anfang einer Geschichte stehen und nicht weiter wissen; wenn Sie Berufsanfänger sind, aber einen grossen Stoff am Wickel haben – wir beraten Sie gern. Bitte schicken Sie Ihre Fragen an recherchen@republik.ch. Sie können dort auch ein Telefonat vereinbaren mit einer unserer Redakteurinnen. Wir versprechen: Wir behandeln Ihre Informationen vertraulich. Sie können sich danach immer noch entscheiden, ob Sie die Story bei uns vorstellen möchten.</P>
        <P>Der Fonds für grosse Recherchen, Geschichten und Ideen kommt von der Project R Genossenschaft, dem gemeinnützigen Dach über der Republik. Project R will die Demokratie stärken, indem sie den Journalismus als vierte Gewalt weiterentwickelt. Dem Gemeinwohl verpflichtet, fördert Project R den konstruktiven Diskurs und diskriminierungsfreie, vielfältige Debatten über die Fragen unserer Zeit.</P>
        <P>Entschieden wird über die Projekte ausschliesslich innerhalb der Republik-Redaktion und ausschliesslich nach journalistischen Kriterien. Wir freuen uns, von Ihnen zu hören!</P>
        <P>Das Team von Republik und <A href='https://project-r.construction'>Project R</A></P>
        <P>PS: Unser <A href='/2018/01/19/usa-serie'>erster Serienprototyp</A> wurde bereits mit Mitteln aus dem Etat finanziert.</P>

      </Frame>
    )
  })
)
