// TODO: Move autosize to styleguide and delete here.
import React from 'react'
import {css} from 'glamor'
import AutosizeInput from 'react-textarea-autosize'

import {
  FieldSet
} from '@project-r/styleguide'

export const styles = {
  autoSize: css({
    minHeight: 40,
    paddingTop: '7px !important',
    paddingBottom: '6px !important'
  })
}

const FieldSetWithAutoSize = props => (
  <FieldSet
    {...props}
    additionalFieldProps={field => {
      const fieldProps = {}
      if (field.autoSize) {
        fieldProps.renderInput = ({ref, ...inputProps}) => (
          <AutosizeInput {...styles.autoSize}
            {...inputProps}
            inputRef={ref} />
        )
      }
      return fieldProps
    }} />
)

FieldSetWithAutoSize.utils = FieldSet.utils

export default FieldSetWithAutoSize
