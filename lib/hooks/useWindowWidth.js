import React from 'react'

export const useWindowWidth = () => {
  const [width, setWidth] = React.useState(undefined)

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setWidth])

  return width
}
