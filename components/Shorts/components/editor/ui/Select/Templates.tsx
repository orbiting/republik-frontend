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
import {
  CustomElement,
  CustomElementsType,
  TemplateButtonI
} from '../../../custom-types'
import { config as elConfig } from '../../../elements'

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

const getChildren = (element: { type: CustomElementsType }): CustomElement => ({
  ...element,
  children: elConfig[element.type].structure?.map(getChildren) || [{ text: '' }]
})

const getTree = (customElement?: CustomElementsType): CustomElement[] => {
  const template = BASE_TEMPLATE.concat(customElement || []).map(e => ({
    type: e
  }))
  return template.map(getChildren)
}

const TemplatePicker: React.FC<{
  setValue: (t: CustomElement[]) => void
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
