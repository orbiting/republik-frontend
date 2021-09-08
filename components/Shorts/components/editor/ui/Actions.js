import React from 'react'
import { css } from 'glamor'
import { Node } from 'slate'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Button, A, Interaction, mediaQueries } from '@project-r/styleguide'
import { useShortDrafts } from '../../../../../lib/shortDrafts'
import { getRandomInt } from '../../../../../lib/utils/helpers'
import uuid from 'uuid/v4'

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

const slug = string =>
  string
    .toLowerCase()
    // eslint-disable-next-line no-control-regex
    .replace(/[^\u0000-\u007E]/g, a => diacriticsMap[a] || a)
    .replace(/[^0-9a-z]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-')

const getTitle = value => (value.length && Node.string(value[0])) || 'Undefined'

const getPublikatorDocument = value => {
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
        data: {
          value: JSON.stringify(value)
        },
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
        children: value.slice(1).map(node => ({
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

const Actions = graphql(commitMutation, {
  props: ({ mutate }) => ({
    commit: variables => mutate({ variables })
  })
})(({ value, reset, localStorageId, commit }) => {
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

  const getDraft = id => ({
    title: getTitle(value),
    id,
    value
  })

  const createDraft = () => setDrafts(drafts.concat(getDraft(uuid())))

  const replaceDraft = () =>
    setDrafts(
      drafts.map(draft =>
        draft.id === localStorageId ? getDraft(localStorageId) : draft
      )
    )

  const saveDraft = () => (localStorageId ? replaceDraft() : createDraft())

  return (
    <div {...styles.buttons}>
      <Button onClick={onCommit}>Submit</Button>
      <Interaction.P style={{ marginLeft: 30 }}>
        <A
          href='#copy-settings'
          onClick={() => {
            saveDraft()
            setTimeout(reset)
          }}
        >
          Save as draft
        </A>
      </Interaction.P>
    </div>
  )
})

export default Actions
