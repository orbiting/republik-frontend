import React from 'react'

// Based on MdExitToApp

const Icon = ({ size, fill, ...props }) => (
  <svg width={size} height={size} viewBox='0 0 24 24' {...props}>
    {/* align with PDF icon */}
    <g transform='translate(0 3)'>
      <path d='M8.41 7.41L7 6l5-5 5 5-1.41 1.41L13 4.83v9.67h-2V4.83L8.41 7.41zM21 19V9h-2v10H5V9H3v10c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2z' fill={fill} fillRule='nonzero' />
    </g>
  </svg>
)

export default Icon
