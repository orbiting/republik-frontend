import React, { Fragment } from 'react'

import { Highlight } from './Elements'

export default {
  Januar: (p) => <Fragment>
    Die Republik startet mit einer grossen <Highlight {...p} series='republik/article-die-gefraessige-genossenschaft'>Serie über die Migros</Highlight> ins zweite Jahr. «<Highlight {...p} series='republik/article-intro'>An der Bar</Highlight>» nimmt GLP-Fraktionschefin Tiana Angelina Moser Platz. Lukas Bärfuss schreibt einen <Highlight {...p} ids={['SwgdwGJEW']}>Essay gegen das Storytelling</Highlight> im Journalismus. Und eine Recherche über das <Highlight {...p} ids={['8bAZr6V2o']}>E-Voting-Projekt der Post</Highlight> sorgt für Wirbel.
  </Fragment>,
  Februar: (p) => <Fragment>
    Das Thema Zersiedelung beschäftigt die Redaktion. In einem <Highlight {...p} ids={['8_3Zpsz5U']}>interaktiven Beitrag</Highlight> zeigen wir auf, wo in Zukunft noch Schnee liegt. Das Thema Gentechnik gibt zu reden. Ausserdem eine Recherche zu den <Highlight {...p} ids={['bPvA8knZW']}>Kriegsgewinnlern in Syrien</Highlight>, ein <Highlight {...p} ids={['48_vcBLSs']}>Essay zu Identitätspolitik</Highlight> und die Frage: Brauchen wir wirklich noch mehr Autobahnen?
  </Fragment>,
  März: (p) => <Fragment>
    Auf <Highlight {...p} ids={['ohlgcekzS']}>Beizentour mit SVP-Nationalrat Fredi Heer</Highlight>. Warum Frauen die Schweiz voranbringen. Eine Reportage aus dem Flüchtlingslager in Lesbos. Die Analyse zum Erfolg der Klimaproteste – und wie sie überleben können. <Highlight {...p} ids={['C8iXl8wpU', '8Va6rD417']}>Die CVP im Wahljahr</Highlight>. Und die grosse Recherche zu den <Highlight {...p} series='republik/article-eth-auftakt' ids={['WTbOUrJ9p']}>Missständen bei der ETH</Highlight>.
  </Fragment>,
  April: (p) => <Fragment>
    Sie fragen ja nur – unser Schwerpunkt zu Verschwörungstheorien. Eine <Highlight {...p} series='republik/article-auftakt-brexit-serie'>Tour durch Brexit-Britannien</Highlight>. Wie (Klima-)Grafiken täuschen können. Und warum Wetterextreme das neue Normal sind. Eine <Highlight {...p} series='republik/article-knonau-master'>Podcast-Serie zum Brand von Knonau</Highlight>. Und <Highlight {...p} series='republik/article-eth-auftakt' ids={['8_xfgyamGq', 'IeTMTN2sP', 'ablDhocUlB']}>Neues von der ETH</Highlight>.
  </Fragment>
}
