import React from 'react'
import { css } from 'glamor'
import { MdSort } from '@react-icons/all-files/md/MdSort'
import { MdWallpaper } from '@react-icons/all-files/md/MdWallpaper'
import { MdShowChart } from '@react-icons/all-files/md/MdShowChart'
import { MdFormatQuote } from '@react-icons/all-files/md/MdFormatQuote'
import { MdPlaylistAddCheck } from '@react-icons/all-files/md/MdPlaylistAddCheck'
import { MdLink } from '@react-icons/all-files/md/MdLink'
// @ts-ignore
import { mediaQueries, fontStyles } from '@project-r/styleguide'
import { textTree } from './text'
import { CustomElement, TemplateButtonI } from '../custom-types'
import { figure } from './figure'
import { quote } from './quote'
import { chart } from './chart'
import { questionnaire } from './questionnaire'
import { link } from './link'

const styles = {
  chartWrapper: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridRowGap: 20,
    [mediaQueries.mUp]: {
      gridTemplateColumns: 'repeat(3, 1fr)'
    }
  }),
  chartButton: css({
    height: 60,
    width: '100%',
    whiteSpace: 'nowrap',
    ...fontStyles.sansSerifRegular14,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px 0',
    ':hover': {
      textDecoration: 'underline'
    }
  }),
  chartButtonText: css({
    display: 'block',
    marginTop: 'auto',
    ':hover': {
      textDecoration: 'underline'
    }
  })
}

const templates: TemplateButtonI[] = [
  { tree: textTree(), label: 'nur Text', icon: MdSort },
  { tree: textTree('Bild').concat(figure()), label: 'Bild', icon: MdWallpaper },
  { tree: textTree('Chart').concat(chart), label: 'Chart', icon: MdShowChart },
  {
    tree: textTree('Umfrage').concat(questionnaire),
    label: 'Umfrage',
    icon: MdPlaylistAddCheck
  },
  {
    tree: textTree('Zitat').concat(quote),
    label: 'Zitat',
    icon: MdFormatQuote
  },
  { tree: textTree('Link').concat(link), label: 'Link', icon: MdLink }
]

export const TemplatePicker: React.FC<{
  setTemplate: (t: CustomElement[]) => void
}> = ({ setTemplate }) => (
  <div {...styles.chartWrapper}>
    {templates.map(template => {
      return (
        <div
          key={template.label}
          {...styles.chartButton}
          onClick={() => setTemplate(template.tree)}
        >
          <template.icon size={24} />
          <span {...styles.chartButtonText}>{template.label}</span>
        </div>
      )
    })}
  </div>
)
