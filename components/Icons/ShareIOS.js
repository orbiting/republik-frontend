import React from 'react'

const iconStyle = {
  verticalAlign: 'middle',
  paddingTop: '2px'
}

const Icon = ({ size, fill }) => (
  <svg width={size} height={size} viewBox='0 0 24 24' style={iconStyle} fill='none' stroke={fill} stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
  >
    <path d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8' />
    <polyline points='16 6 12 2 8 6' />
    <line x1='12' y1='2' x2='12' y2='15' />
  </svg>
)

export default Icon
