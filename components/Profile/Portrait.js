import React from 'react'
import { css } from 'glamor'
// import Dropzone from 'react-dropzone'

const styles = {
  img: css({
    display: 'block',
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  })
}

export default ({user}) => {
  return (
    <span {...styles.img} style={{
      backgroundImage: `url(${user.portrait})`
    }} />
  )

  // return (
  //   <Dropzone
  //     accept='image/jpeg, image/png'
  //     onDrop={(accepted, rejected) => {
  //       this.setState({ accepted, rejected })
  //     }}
  //   >
  //   </Dropzone>
  // )
}
