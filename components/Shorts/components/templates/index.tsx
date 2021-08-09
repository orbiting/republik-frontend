import React from 'react'
import { css } from 'glamor'
import { MdSort } from '@react-icons/all-files/md/MdSort'
import { MdWallpaper } from '@react-icons/all-files/md/MdWallpaper'
import { MdShowChart } from '@react-icons/all-files/md/MdShowChart'
import { MdFormatQuote } from '@react-icons/all-files/md/MdFormatQuote'
import { MdPlaylistAddCheck } from '@react-icons/all-files/md/MdPlaylistAddCheck'
// @ts-ignore
import { mediaQueries, fontStyles, Interaction } from '@project-r/styleguide'
import { textTree } from './text'
import { CustomElement, TemplateButtonI } from '../custom-types'
import { figure } from './figure'
import { quote } from './quote'
import { chart } from './chart'
import { questionnaire } from './questionnaire'

const styles = {
  title: css({
    marginBottom: 20,
    [mediaQueries.mUp]: {
      marginBottom: 40
    }
  }),
  chartWrapper: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridRowGap: 10,
    [mediaQueries.mUp]: {
      gridRowGap: 20
    }
  }),
  chartButton: css({
    height: 60,
    width: 60,
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
  { tree: textTree('Zitat').concat(quote), label: 'Zitat', icon: MdFormatQuote }
]

export const TemplatePicker: React.FC<{
  setTemplate: (t: CustomElement[]) => void
}> = ({ setTemplate }) => (
  <>
    <Interaction.H1 {...styles.title}>⚗️ Kurzformate</Interaction.H1>
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
  </>
)
