import React from 'react'

export const useWindowWidth = () => {
  const [width, setWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : undefined)

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setWidth])

  return width
}
