import React from 'react'
import { css } from 'glamor'

import Close from 'react-icons/lib/md/close'
import Search from 'react-icons/lib/md/search'

import {
  Field,
  colors
} from '@project-r/styleguide'

const styles = {
  icon: css({
    cursor: 'pointer'
  })
}

const Icon = ({IconComponent, onClick, title}) => (
  <span title={title} {...styles.icon}>
    <IconComponent
      fill={colors.text}
      size={30}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }} />
  </span>
)

export default ({value, dirty, onChange, onSearch, onReset, onClose}) => (
  <div>
    <Field
      label='Suche'
      value={value}
      onChange={onChange}
      onSearch={onSearch}
      onReset={() => {}}
      icon={
        !value
          ? <Icon IconComponent={Close} onClick={onClose} title='Suche schliessen' />
          : dirty
            ? <Icon IconComponent={Search} onClick={onSearch} title='Suchen' />
            : <Icon IconComponent={Close} onClick={onReset} title='Suche zurücksetzen' />
      }
    />
  </div>
)
