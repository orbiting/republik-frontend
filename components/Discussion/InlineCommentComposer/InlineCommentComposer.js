import React, {PureComponent} from 'react'
import {css} from 'glamor'
import {MdClose} from 'react-icons/lib/md'
import {colors} from '@project-r/styleguide'
import {fontFamilies} from '@project-r/styleguide/lib/theme/fonts'

const inlineCommentComposerStyles = {
  root: css({
  }),
  form: css({
    background: '#F8F8F8',
    marginTop: '1px'
  }),
  textArea: css({
    padding: '6px 12px 0',
    width: '100%',
    minWidth: '100%',
    maxWidth: '100%',
    minHeight: '100px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: fontFamilies.serifRegular,
    fontSize: '16px',
    lineHeight: '26px',
    color: colors.text
  }),
  textAreaEmpty: css({
    color: '#979797'
  }),
  actions: css({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '40px'
  }),
  cancelButton: css({
    '-webkit-appearance': 'none',
    background: 'transparent',
    border: 'none',
    padding: '0 6px',
    cursor: 'pointer',

    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px'
  }),
  commitButton: css({
    '-webkit-appearance': 'none',
    background: 'transparent',
    border: 'none',
    padding: '0 12px 0 6px',
    cursor: 'pointer',

    fontFamily: fontFamilies.sansRegular,
    fontSize: '16px',
    lineHeight: '26px',
    color: '#B98C6C',

    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center'
  })
}

class InlineCommentComposer extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      text: ''
    }

    this.onChange = ev => {
      this.setState({text: ev.target.value})
    }
  }

  render () {
    const {onCancel} = this.props
    const {text} = this.state

    return (
      <div {...inlineCommentComposerStyles.root}>
        <div {...inlineCommentComposerStyles.form}>
          <textarea
            {...inlineCommentComposerStyles.textArea}
            {...(text === '' ? inlineCommentComposerStyles.textAreaEmpty : {})}
            placeholder='Einen Kommentar verfassen…'
            value={text}
            rows='5'
            onChange={this.onChange}
          />

          <div {...inlineCommentComposerStyles.actions}>
            <button {...inlineCommentComposerStyles.cancelButton} onClick={onCancel}>
              <MdClose />
            </button>
            <button {...inlineCommentComposerStyles.commitButton}>
              Antworten
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default InlineCommentComposer
