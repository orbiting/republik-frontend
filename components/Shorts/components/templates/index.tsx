import React from 'react'
import { Descendant } from 'slate'
import { css } from 'glamor'
import { MdSort } from '@react-icons/all-files/md/MdSort'
import { MdWallpaper } from '@react-icons/all-files/md/MdWallpaper'
import { MdShowChart } from '@react-icons/all-files/md/MdShowChart'
import { MdFormatQuote } from '@react-icons/all-files/md/MdFormatQuote'
// @ts-ignore
import { mediaQueries, fontStyles, Interaction } from '@project-r/styleguide'
import { textTree } from './text'
import { CustomElement, TemplateButtonI } from '../custom-types'
import { figure } from './figure'
import { quote } from './quote'
import { chart } from './chart'

const styles = {
  container: css({
    textAlign: 'center'
  }),
  title: css({
    marginBottom: 20,
    [mediaQueries.mUp]: {
      marginBottom: 40
    }
  }),
  chartWrapper: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridRowGap: 20,
    marginTop: 20,
    [mediaQueries.mUp]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridRowGap: 40,
      marginTop: 40
    }
  }),
  chartButton: css({
    height: 60,
    width: 120,
    whiteSpace: 'nowrap',
    ...fontStyles.sansSerifRegular14,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 auto',
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
  { tree: textTree.concat(figure()), label: 'Bild', icon: MdWallpaper },
  { tree: textTree.concat(chart), label: 'Chart', icon: MdShowChart },
  { tree: textTree.concat(quote), label: 'Zitat', icon: MdFormatQuote },
  { tree: textTree, label: 'nur Text', icon: MdSort }
]

export const TemplatePicker: React.FC<{
  setTemplate: (t: CustomElement[]) => void
}> = ({ setTemplate }) => (
  <div {...styles.container}>
    <Interaction.H1 {...styles.title}>Welcome to the lab</Interaction.H1>
    <Interaction.P>Pick your poison ⚗️</Interaction.P>
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
  </div>
)
