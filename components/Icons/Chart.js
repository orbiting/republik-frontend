import React from 'react'

const Icon = ({ size, fill }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 20 20'
    style={{ verticalAlign: 'middle' }}
  >
    <path
      fill={fill}
      d='M18.3,0 L1.7,0 C0.8,0 0,0.8 0,1.7 L0,18.3 C0,19.2 0.8,20 1.7,20 L18.3,20 C19.2,20 20,19.2 20,18.3 L20,1.7 C20,0.8 19.2,0 18.3,0 Z M6.5,17.5 L2.5,17.5 L2.5,6.3 L6.5,6.3 L6.5,17.5 Z M11.9,17.5 L7.9,17.5 L7.9,10 L11.9,10 L11.9,17.5 Z M17.4,17.4 L13.4,17.4 L13.4,2.4 L17.4,2.4 L17.4,17.4 Z'
    />
  </svg>
)

export default Icon
