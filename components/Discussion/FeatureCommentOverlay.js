import React, { useState } from 'react'
import {
  Interaction,
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarClose,
  ActiveDebateTeaser,
  Field,
  Button,
  Label,
  useColorContext,
  CommentTeaser,
  Checkbox
} from '@project-r/styleguide'
import { compose, graphql } from 'react-apollo'
import AutosizeInput from 'react-textarea-autosize'

import withT from '../../lib/withT'
import { styles as fieldSetStyles } from '../FieldSet'
import ErrorMessage from '../ErrorMessage'

import { featureCommentMutation } from './graphql/documents'
import { css } from 'glamor'

const TARGETS = ['DEFAULT', 'MARKETING']

const TargetCheckbox = ({ t, targets, setTargets, targetKey }) => (
  <div {...styles.checkbox}>
    <Checkbox
      checked={targets.includes(targetKey)}
      onChange={(_, checked) => {
        setTargets(
          targets.filter(t => t !== targetKey).concat(checked ? targetKey : [])
        )
      }}
    >
      {t(`FeatureCommentOverlay/${targetKey}/add`)}
    </Checkbox>
  </div>
)

export const FeatureCommentOverlay = compose(
  withT,
  graphql(featureCommentMutation)
)(({ t, discussion, comment, onClose, mutate }) => {
  const [mutatingState, setMutatingState] = useState({})
  const [targets, setTargets] = useState(
    comment.featuredTargets || [TARGETS[0]]
  )
  const [text, setText] = useState(comment.featuredText || comment.text)
  const [colorScheme] = useColorContext()
  return (
    <Overlay onClose={onClose} mUpStyle={{ minHeight: 0 }}>
      <OverlayToolbar>
        <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
          {t('FeatureCommentOverlay/title')}
        </Interaction.Emphasis>
        <OverlayToolbarClose onClick={onClose} />
      </OverlayToolbar>
      <OverlayBody>
        <div>
          {TARGETS.map(target => (
            <TargetCheckbox
              key={target}
              targetKey={target}
              targets={targets}
              setTargets={setTargets}
              t={t}
            />
          ))}
        </div>
        {targets.length ? (
          <Field
            label={t(`FeatureCommentOverlay/text/label`)}
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
        ) : (
          <Interaction.P {...colorScheme.set('color', 'textSoft')}>
            <small>
              <em>{t('FeatureCommentOverlay/warning')}</em>
            </small>
          </Interaction.P>
        )}
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
                content: targets.length ? text : null,
                targets
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
          {t('FeatureCommentOverlay/submit')}
        </Button>
        <div {...styles.preview}>
          {targets.includes('DEFAULT') && (
            <div>
              <Label>{t('FeatureCommentOverlay/front/preview')}</Label>
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
            </div>
          )}
          {targets.includes('MARKETING') && (
            <div>
              <Label>{t('FeatureCommentOverlay/marketing/preview')}</Label>
              <CommentTeaser
                {...{
                  ...comment,
                  featuredText: text,
                  discussion: {
                    ...discussion,
                    image: discussion?.document?.meta?.twitterImage
                  }
                }}
                t={t}
              />
            </div>
          )}
        </div>
      </OverlayBody>
    </Overlay>
  )
})

const styles = {
  checkbox: css({
    display: 'inline-block',
    marginRight: 25
  }),
  preview: css({
    marginTop: 30
  })
}
