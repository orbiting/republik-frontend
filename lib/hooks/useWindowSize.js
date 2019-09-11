import React from 'react'

export const useWindowSize = () => {
  const [size, setSize] = React.useState([])

  React.useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight])
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setSize])

  return size
}
