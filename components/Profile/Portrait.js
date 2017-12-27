import React, { Component } from 'react'
import { css } from 'glamor'
import Dropzone from 'react-dropzone'

export default () => (
  <Dropzone
    accept='image/jpeg, image/png'
    onDrop={(accepted, rejected) => {
      this.setState({ accepted, rejected })
    }}
  >
    <p>Try dropping some files here, or click to select files to upload.</p>
    <p>Only *.jpeg and *.png images will be accepted</p>
  </Dropzone>
)
