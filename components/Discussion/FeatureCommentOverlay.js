import React, { useState, useRef } from 'react'
import {
  Interaction,
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarConfirm,
  ActiveDebateTeaser,
  Field,
  Button,
  Label,
  useColorContext,
  A,
  CommentTeaser
} from '@project-r/styleguide'
import { MdClose, MdVisibilityOff, MdAdd } from 'react-icons/md'
import { compose, graphql } from 'react-apollo'
import AutosizeInput from 'react-textarea-autosize'

import withT from '../../lib/withT'
import { styles as fieldSetStyles } from '../FieldSet'
import ErrorMessage from '../ErrorMessage'

import { featureCommentMutation } from './graphql/documents'
import { css } from 'glamor'

const FeaturedText = ({ t, translationKey, text, setText, defaultText }) => {
  const [colorScheme] = useColorContext()

  const ref = useRef(null)
  return (
    <div {...styles.formContainer}>
      {text ? (
        <>
          <A
            href='#'
            onClick={() => setText(null)}
            {...styles.removeText}
            title={t('FeatureCommentOverlay/remove')}
          >
            <MdVisibilityOff
              size={20}
              {...colorScheme.set('fill', 'textSoft')}
            />
          </A>
          <Field
            label={t(`FeatureCommentOverlay/${translationKey}/text/label`)}
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
        </>
      ) : (
        <A href='#' onClick={() => setText(defaultText)}>
          <MdAdd /> {t(`FeatureCommentOverlay/${translationKey}/add`)}
        </A>
      )}
    </div>
  )
}

export const FeatureCommentOverlay = compose(
  withT,
  graphql(featureCommentMutation)
)(({ t, discussion, comment, onClose, mutate }) => {
  const [mutatingState, setMutatingState] = useState({})
  const [frontText, setFrontText] = useState(comment.featuredText)
  const [marketingText, setMarketingText] = useState(comment.featuredText)
  const [colorScheme] = useColorContext()
  return (
    <Overlay onClose={onClose} mUpStyle={{ minHeight: 'none' }}>
      <OverlayToolbar>
        <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
          {t('FeatureCommentOverlay/title')}
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<MdClose size={24} {...colorScheme.set('fill', 'text')} />}
        />
      </OverlayToolbar>
      <OverlayBody>
        <div {...styles.formsContainer}>
          <FeaturedText
            t={t}
            translationKey='front'
            text={frontText}
            setText={setFrontText}
            defaultText={comment.text}
          />
          <FeaturedText
            t={t}
            translationKey='marketing'
            text={marketingText}
            setText={setMarketingText}
            defaultText={comment.text}
          />
          {!frontText && !marketingText && (
            <Interaction.P {...colorScheme.set('color', 'textSoft')}>
              <small>
                <em>{t('FeatureCommentOverlay/warning')}</em>
              </small>
            </Interaction.P>
          )}
          {mutatingState.error && <ErrorMessage error={mutatingState.error} />}
        </div>
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
                content: frontText
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
          {frontText && (
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
                        highlight: frontText
                      }
                    ]
                  }
                }}
              />
            </div>
          )}
          {marketingText && (
            <div>
              <Label>{t('FeatureCommentOverlay/marketing/preview')}</Label>
              <CommentTeaser
                {...{ ...comment, featuredText: marketingText }}
                discussion={discussion}
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
  formContainer: css({
    position: 'relative',
    marginBottom: 5
  }),
  removeText: css({
    position: 'absolute',
    right: 0,
    top: 5,
    zIndex: 2
  }),
  formsContainer: css({
    marginBottom: 20
  }),
  preview: css({
    marginTop: 30
  })
}
