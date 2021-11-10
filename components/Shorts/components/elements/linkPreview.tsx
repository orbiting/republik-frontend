import {
  DataFormProps,
  dataRequiredType,
  ElementConfigI,
  LinkPreviewElement
} from '../../custom-types'
import React, { Attributes, ReactElement } from 'react'
import { Embed } from '@project-r/styleguide/lib/components/Discussion/Internal/Comment/Embed'
import { Loader } from '@project-r/styleguide'
import gql from 'graphql-tag'
import { graphql } from '@apollo/client/react/hoc'
import { PUBLIC_BASE_URL } from '../../../../lib/constants'

export const getPreview = gql`
  query getDocument($path: String!) {
    document(path: $path) {
      id
      repoId
      meta {
        title
        description
        image
        path
      }
    }
  }
`

type EmbedType = {
  title: string
  description: string
  image: string
  path: string
}

type InputType = {
  path: string
}

type ResponseType = {
  document: {
    id: string
    repoId: string
    meta: EmbedType
  }
}

const withPreview = graphql<InputType, ResponseType, InputType>(getPreview)

const LinkPreview = withPreview(({ data }) => (
  <Loader
    loading={data?.loading}
    error={data?.error}
    render={() => {
      const meta = data?.document?.meta
      if (!meta) return null
      return (
        <Embed
          comment={{
            embed: {
              url: meta.path,
              title: meta.title,
              description: meta.description,
              imageUrl: meta.image,
              siteName: 'republik.ch',
              siteImageUrl: '/static/apple-touch-icon.png',
              __typename: 'LinkPreview'
            }
          }}
        />
      )
    }}
  />
))

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
  element: LinkPreviewElement
}> = ({ attributes, children, element }) => (
  <div {...attributes}>
    {element.src && (
      <LinkPreview path={element.src.replace(PUBLIC_BASE_URL, '')} />
    )}
    {children}
  </div>
)

const DataForm: React.FC<DataFormProps<LinkPreviewElement>> = ({
  element,
  setElement
}) => <div>TODO</div>

const dataRequired: dataRequiredType<LinkPreviewElement> = ['src']

export const config: ElementConfigI = {
  Component,
  DataForm,
  dataRequired,
  attrs: {
    isVoid: true,
    editUi: true
  }
}
