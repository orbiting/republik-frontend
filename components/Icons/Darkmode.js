import React from 'react'

const Darkmode = ({ size = 24, fill, ...props }) => (
  <svg width={size} height={size} viewBox='0 0 25 25' {...props}>
    <path
      d='M2 12.715C2 7.195 6.48 2.715 12 2.715C17.52 2.715 22 7.195 22 12.715C22 18.235 17.52 22.715 12 22.715C6.48 22.715 2 18.235 2 12.715ZM4 12.715C4 17.125 7.59 20.715 12 20.715V17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9V4.715C7.59 4.715 4 8.305 4 12.715Z'
      fill={fill}
    />
    <path
      d='M8 13C8 15.2091 9.79086 17 12 17V9C9.79086 9 8 10.7909 8 13Z'
      fill={fill}
    />
  </svg>
)

export default Darkmode
