import React, { useState } from 'react'
import {
  Interaction,
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarConfirm,
  ActiveDebateTeaser,
  Field,
  Button,
  Label
} from '@project-r/styleguide'
import { MdClose } from 'react-icons/md'
import { compose, graphql } from 'react-apollo'
import AutosizeInput from 'react-textarea-autosize'

import withT from '../../lib/withT'
import { styles as fieldSetStyles } from '../FieldSet'
import ErrorMessage from '../ErrorMessage'

import { featureCommentMutation } from './graphql/documents'

export const FeatureCommentOverlay = compose(
  withT,
  graphql(featureCommentMutation)
)(({ t, discussion, comment, onClose, mutate }) => {
  const [mutatingState, setMutatingState] = useState({})
  const [text, setText] = useState(comment.featuredText || comment.text)
  return (
    <Overlay onClose={onClose} mUpStyle={{ minHeight: 'none' }}>
      <OverlayToolbar>
        <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
          {t('FeatureCommentOverlay/title')}
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<MdClose size={24} fill='#000' />}
        />
      </OverlayToolbar>
      <OverlayBody style={{ paddingTop: 58 }}>
        <Field
          label={t('FeatureCommentOverlay/text/label')}
          renderInput={({ ref, ...inputProps }) => (
            <AutosizeInput
              {...inputProps}
              {...fieldSetStyles.autoSize}
              inputRef={ref}
            />
          )}
          value={text}
          onChange={(_, value, shouldValidate) => setText(value)}
        />
        {mutatingState.error && <ErrorMessage error={mutatingState.error} />}
        <Button
          disabled={mutatingState.loading}
          primary
          type='submit'
          onClick={() => {
            setMutatingState({
              loading: true
            })
            mutate({
              variables: {
                commentId: comment.id,
                content: text
              }
            })
              .then(() => {
                onClose()
              })
              .catch(error => {
                setMutatingState({
                  error
                })
              })
          }}
        >
          {t(
            comment.featuredText
              ? 'FeatureCommentOverlay/resubmit'
              : 'FeatureCommentOverlay/submit'
          )}
        </Button>
        {!!comment.featuredText && (
          <>
            {' '}
            <Button
              disabled={mutatingState.loading}
              onClick={() => {
                setMutatingState({
                  loading: true
                })
                mutate({
                  variables: {
                    commentId: comment.id,
                    content: null
                  }
                })
                  .then(() => {
                    onClose()
                  })
                  .catch(error => {
                    setMutatingState({
                      error
                    })
                  })
              }}
            >
              {t('FeatureCommentOverlay/remove')}
            </Button>
          </>
        )}
        <br />
        <br />
        <Label>{t('FeatureCommentOverlay/preview')}</Label>
        <br />
        <br />
        <ActiveDebateTeaser
          t={t}
          discussion={{
            ...discussion,
            comments: {
              ...discussion.comments,
              nodes: [
                {
                  ...comment,
                  highlight: text
                }
              ]
            }
          }}
        />
      </OverlayBody>
    </Overlay>
  )
})
