import React, { Component } from 'react'
import { compose } from 'redux'
import withT from '../../lib/withT'
import { validate as isEmail } from 'email-validator'
import { Button, Field } from '@project-r/styleguide'

// TODO: hook this up with a backend mutation.

class PreviewForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: props.email || '',
      loading: false,
      success: undefined
    }
  }

  render () {
    const { t } = this.props
    const { loading, error, dirty, email } = this.state
    return (
      <div>
        <Field
          name='email'
          type='email'
          label={t('marketing/preview/email/label')}
          error={dirty && error}
          onChange={(_, value, shouldValidate) => {
            this.setState(() => ({
              email: value,
              error:
                (value.trim().length <= 0 &&
                  t('marketing/preview/email/error/empty')) ||
                (!isEmail(value) && t('marketing/preview/email/error/invalid')),
              dirty: shouldValidate
            }))
          }}
          value={email}
        />
        <Button
          onClick={() => {
            if (error) {
              this.setState(() => ({
                dirty: true
              }))
              return
            }
            if (loading) {
              return
            }
            this.setState(() => ({
              loading: true
            }))
          }}
        >
          Bestellen
        </Button>
      </div>
    )
  }
}

export default compose(withT)(PreviewForm)
