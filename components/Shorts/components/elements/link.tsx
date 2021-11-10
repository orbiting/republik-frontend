import { Transforms, Range, Path } from 'slate'
import { MdLink } from '@react-icons/all-files/md/MdLink'
import {
  CustomEditor,
  ElementConfigI,
  InsertFn,
  LinkElement,
  NormalizeFn
} from '../../custom-types'
import { Editorial } from '@project-r/styleguide'

const unlink = (editor: CustomEditor, linkPath: Path): void => {
  Transforms.unwrapNodes(editor, { at: linkPath })
}

const link = (editor: CustomEditor, href: string): void => {
  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const element: LinkElement = {
    type: 'link',
    href,
    children: isCollapsed ? [{ text: href }] : []
  }
  if (isCollapsed) {
    Transforms.insertNodes(editor, element)
  } else {
    Transforms.wrapNodes(editor, element, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

const insert: InsertFn = editor => {
  const href = window.prompt('Enter the URL of the link:')
  return href && link(editor, href)
}

const unlinkWhenEmpty: NormalizeFn<LinkElement> = (
  [link, linkPath],
  editor
) => {
  if (!link.href) {
    unlink(editor, linkPath)
  }
}

export const config: ElementConfigI = {
  Component: Editorial.A,
  insert,
  normalizations: [unlinkWhenEmpty],
  attrs: {
    isInline: true,
    editUi: true,
    formatText: true
  },
  button: { icon: MdLink, toolbar: 'hovering' }
}
