import React, { Fragment } from 'react'
import voteT from '../voteT'
import md from 'markdown-in-js'
import { mdComponents } from '../text'

const VoteInfo = ({ vt }) => (
  <Fragment>
    {md(mdComponents)`
# Herzlich willkommen auf unserer Abstimmungsplattform!

Zugegeben, noch ist diese Bezeichnung nicht mehr als eine Behauptung.

Ab dem 13. Dezember 2019 werden Sie hier Unterlagen zum vergangenen Geschäftsjahr finden.

Bis zum 23. Dezember können Sie dann über vier Dinge abstimmen: den Geschäftsbericht, die Jahresrechnung, die Entlastung des Vorstands und den Wahlvorschlag für die Revisionsstelle. Abstimmungsberechtigt sind alle, die am Tag des Abstimmungsbeginns eine Jahresmitgliedschaft bei Project R haben.
    `}
  </Fragment>
)

export default voteT(VoteInfo)
