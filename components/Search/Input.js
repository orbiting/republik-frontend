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

const SearchIcon = ({onSearch}) => (
  <Search
    {...styles.icon}
    fill={colors.text}
    size={30}
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      onSearch()
    }} />
)

const ResetIcon = ({onReset}) => (
  <Close
    {...styles.icon}
    fill={colors.text}
    size={30}
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      onReset()
    }} />
)

export default ({value, dirty, onChange, onSearch, onReset}) => (
  <div>
    <Field
      label='Suche'
      value={value}
      onChange={onChange}
      onSearch={onSearch}
      onReset={() => {}}
      icon={
        !value
          ? null
          : dirty
            ? <SearchIcon onSearch={onSearch} />
            : <ResetIcon onReset={onReset} />
      }
    />
  </div>
)
