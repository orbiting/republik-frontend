import React from 'react'
import { getRandomInt } from '../../../../../lib/utils/helpers'
// @ts-ignore
import { Button, A, Interaction, mediaQueries } from '@project-r/styleguide'
import { css } from 'glamor'
import { Descendant, Node } from 'slate'
import { useShortDrafts } from '../../../../../lib/shortDrafts'
import { CustomElement, DraftI } from '../../custom-types'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const commitMutation = gql`
  mutation commit(
    $repoId: ID!
    $parentId: ID
    $message: String!
    $document: DocumentInput!
    $isTemplate: Boolean
  ) {
    commit(
      repoId: $repoId
      parentId: $parentId
      message: $message
      document: $document
      isTemplate: $isTemplate
    ) {
      repo {
        id
      }
    }
  }
`

const styles = {
  buttons: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    [mediaQueries.mUp]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
      marginTop: 80
    }
  })
}

const diacritics = [
  { base: 'a', letters: ['â', 'à'] },
  { base: 'c', letters: ['ç'] },
  { base: 'e', letters: ['é', 'ê', 'è', 'ë'] },
  { base: 'i', letters: ['î', 'ï'] },
  { base: 'o', letters: ['ô'] },
  { base: 'u', letters: ['ù', 'û'] },
  { base: 'ss', letters: ['ß'] },
  { base: 'ae', letters: ['ä'] },
  { base: 'ue', letters: ['ü'] },
  { base: 'oe', letters: ['ö'] }
]

const diacriticsMap = diacritics.reduce((map, diacritic) => {
  diacritic.letters.forEach(letter => {
    map[letter] = diacritic.base
  })
  return map
}, {})

const slug = (string: string): string =>
  string
    .toLowerCase()
    .replace(/[^\u0000-\u007E]/g, a => diacriticsMap[a] || a)
    .replace(/[^0-9a-z]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-')

const getTitle = (value: CustomElement[]): string =>
  (value.length && Node.string(value[0])) || 'Undefined'

const getKey = (value: CustomElement[], drafts: DraftI[]): string => {
  const title = getTitle(value)
  const duplicates = drafts.filter(d => d.key.split('-')[0] === title).length
  return `${title}${duplicates ? '-' + duplicates : ''}`
}

const getPublikatorDocument = (value: CustomElement[]): object => {
  const title = getTitle(value)
  return {
    type: 'root',
    meta: {
      template: 'article',
      title,
      auto: true,
      feed: true,
      gallery: true,
      description: '',
      slug: slug(title)
    },
    children: [
      {
        type: 'zone',
        identifier: 'TITLE',
        data: {},
        children: [
          {
            type: 'heading',
            depth: 1,
            children: [
              {
                type: 'text',
                value: title
              }
            ]
          },
          {
            type: 'heading',
            depth: 2,
            children: [
              {
                type: 'text',
                value: ''
              }
            ]
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: '⁣'
              }
            ]
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: ''
              }
            ]
          }
        ]
      },
      {
        type: 'zone',
        identifier: 'CENTER',
        data: {
          value
        },
        children: (value.slice(1)).map(node => ({
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: Node.string(node)
            }
          ]
        }))
      }
    ]
  }
}

const Actions: React.FC<{
  value: CustomElement[]
  reset: () => void
  commit: (variables: any) => Promise<any>
}> = ({ value, reset, commit }) => {
  const [drafts, setDrafts] = useShortDrafts([])

  const onCommit = () => {
    commit({
      repoId: `kurz-${getRandomInt(9999)}`,
      parentId: null,
      isTemplate: false,
      message: 'kurzformat workshop init',
      document: {
        content: getPublikatorDocument(value)
      }
    }).then(reset)
  }

  return (
    <div {...styles.buttons}>
      <Button onClick={onCommit}>Submit</Button>
      <Interaction.P style={{ marginLeft: 30 }}>
        <A
          href='#copy-settings'
          onClick={() => {
            setDrafts(
              drafts.concat({
                key: getKey(value, drafts),
                date: new Date(),
                value
              })
            )
            setTimeout(reset)
          }}
        >
          Save as draft
        </A>
      </Interaction.P>
    </div>
  )
}

export default graphql(commitMutation, {
  props: ({ mutate }) => ({
    // @ts-ignore
    commit: (variables: any): Promise<any> => mutate({ variables })
  })
  // @ts-ignore
})(Actions)
