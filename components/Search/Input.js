import React from 'react'

import Search from 'react-icons/lib/md/search'

import {
  Field,
  colors
} from '@project-r/styleguide'

const SearchIcon = ({onSearch}) => (
  <Search
    fill={colors.text}
    size={30}
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      onSearch()
    }} />
)

export default ({value, label, count, onChange, onSearch}) => (
  <div>
    <Field
      label='Suche'
      value={value}
      onChange={onChange}
      onSearch={onSearch}
      onReset={() => {}}
      icon={<SearchIcon onSearch={onSearch} />}
    />
  </div>
)
