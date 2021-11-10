import React from 'react'
import { css } from 'glamor'
import { MdSort } from '@react-icons/all-files/md/MdSort'
import { MdWallpaper } from '@react-icons/all-files/md/MdWallpaper'
import { MdShowChart } from '@react-icons/all-files/md/MdShowChart'
import { MdFormatQuote } from '@react-icons/all-files/md/MdFormatQuote'
import { MdPlaylistAddCheck } from '@react-icons/all-files/md/MdPlaylistAddCheck'
import { MdLink } from '@react-icons/all-files/md/MdLink'
import { mediaQueries, fontStyles } from '@project-r/styleguide'
import {
  CustomDescendant,
  CustomElementsType,
  NodeStructureT,
  TemplateButtonI
} from '../../../../custom-types'
import { buildNode } from '../../helpers/structure'

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

export const BASE_TEMPLATE: CustomElementsType[] = ['headline', 'paragraph']

const templates: TemplateButtonI[] = [
  { label: 'nur Text', icon: MdSort },
  { customElement: 'figure', label: 'Bild', icon: MdWallpaper },
  { customElement: 'chartContainer', label: 'Chart', icon: MdShowChart },
  {
    customElement: 'questionnaire',
    label: 'Umfrage',
    icon: MdPlaylistAddCheck
  },
  {
    customElement: 'pullQuote',
    label: 'Zitat',
    icon: MdFormatQuote
  },
  { customElement: 'linkPreview', label: 'Link', icon: MdLink }
]

const getTree = (customElement?: CustomElementsType): CustomDescendant[] => {
  const structure = BASE_TEMPLATE.concat(customElement || []).map(e => ({
    type: e
  })) as NodeStructureT[]
  return structure.map(s => buildNode(s, true))
}

const TemplatePicker: React.FC<{
  setValue: (t: CustomDescendant[]) => void
}> = ({ setValue }) => (
  <div {...styles.chartWrapper}>
    {templates.map(template => {
      return (
        <div
          key={template.label}
          {...styles.chartButton}
          onClick={() => setValue(getTree(template.customElement))}
        >
          <template.icon size={24} />
          <span {...styles.chartButtonText}>{template.label}</span>
        </div>
      )
    })}
  </div>
)

export default TemplatePicker
