import React from 'react'
import dynamic from 'next/dynamic'

import {
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarConfirm,
  Interaction,
  A,
  useColorContext
} from '@project-r/styleguide'

import { MdClose } from 'react-icons/md'
import Loader from '../Loader'
import { compose, graphql } from 'react-apollo'
import { getDocument } from '../Article/graphql/getDocument'
import { splitByTitle } from '../../lib/utils/mdast'
import { renderMdast } from 'mdast-react-render'
import createPageSchema from '@project-r/styleguide/lib/templates/Page'

const localPages = [
  {
    href: '/agb',
    content: dynamic(
      () => import('../../pages/legal/tos.js').then(mod => mod.Content),
      { loading: () => <Loader /> }
    )
  },
  {
    href: '/datenschutz',
    content: dynamic(
      () => import('../../pages/legal/privacy.js').then(mod => mod.Content),
      { loading: () => <Loader /> }
    )
  },
  {
    href: '/statuten',
    content: false // loads from Publikator
  }
]

export const SUPPORTED_HREFS = localPages.map(p => p.href)

const RenderArticle = ({ article }) => {
  const splitContent = article && splitByTitle(article.content)
  const renderSchema = content =>
    renderMdast(
      {
        ...content,
        format: undefined,
        section: undefined,
        series: undefined,
        repoId: article.repoId
      },
      createPageSchema(article.meta.template),
      { MissingNode: ({ children }) => children }
    )

  return renderSchema(splitContent.main)
}

const LegalOverlay = ({ onClose, href, title, data }) => {
  const [colorScheme] = useColorContext()
  const page = localPages.find(p => p.href === href)

  return (
    <Overlay mUpStyle={{ maxWidth: 720, minHeight: 0 }} onClose={onClose}>
      <OverlayToolbar>
        <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
          {title}
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<MdClose size={24} {...colorScheme.set('fill', 'text')} />}
        />
      </OverlayToolbar>
      <OverlayBody>
        {page && page.content ? (
          <page.content />
        ) : data && data.article ? (
          <RenderArticle article={data.article} />
        ) : (
          <Interaction.P>
            <A href={href} target='_blank'>
              Jetzt anzeigen
            </A>
          </Interaction.P>
        )}
      </OverlayBody>
    </Overlay>
  )
}

export default compose(
  graphql(getDocument, {
    skip: props => localPages.find(p => p.href === props.href && p.content),
    options: props => ({
      variables: {
        path: props.href
      }
    })
  })
)(LegalOverlay)
