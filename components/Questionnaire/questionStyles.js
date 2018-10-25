import React, { Component } from 'react'
import Loader from '../Loader'
import { css, merge } from 'glamor'

import {
  colors,
  NarrowContainer,
  FigureCaption,
  FigureImage,
  Interaction,
  mediaQueries,
  RawHtml,
  TextInput
} from '@project-r/styleguide'

export const questionStyles = {
  label: css({
    margin: '50px 0 10px 0'
  }),
  body: css({
    margin: '5px 0 10px 0',
    minHeight: 75,
    width: '100%'
  })
}
