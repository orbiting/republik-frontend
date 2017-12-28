import React from 'react'
import { css } from 'glamor'
import Dropzone from 'react-dropzone'

import withT from '../../lib/withT'

const styles = {
  img: css({
    display: 'block',
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }),
  preview: css({
    filter: 'grayscale(1)'
  }),
  dropzone: css({
    position: 'relative',
    width: '100%',
    height: '100%'
  }),
  note: css({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '5px 10px',
    color: '#fff'
  })
}

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new window.FileReader()
    fileReader.addEventListener('load', (event) => {
      const url = event.target.result

      // Strip out the information about the mime type of the file and the encoding
      // at the beginning of the file (e.g. data:image/gif;base64,).
      const content = url.replace(/^(.+,)/, '')

      resolve({
        filename: file.name,
        url,
        content
      })
    })

    fileReader.addEventListener('error', (error) => {
      reject(error)
    })

    fileReader.readAsDataURL(file)
  })
}

export default withT(({t, user, isEditing, values, errors, onChange}) => {
  const preview = isEditing && values.portraitPreview
  const img = (
    <span {...styles.img} {...(preview && styles.preview)}
      style={{
        backgroundImage: `url(${preview || user.portrait})`
      }} />
  )

  const getNote = () => {
    if (!isEditing) {
      return
    }
    if (errors && errors.portrait) {
      return errors.portrait
    }
    if (!user.portrait && !values.portraitPreview) {
      return t('profile/portrait/choose')
    }
    if (user.portrait && !values.portraitPreview) {
      return t('profile/portrait/update')
    }
    return false
  }
  const note = getNote()

  return (
    <Dropzone
      disablePreview
      className={styles.dropzone.toString()}
      style={{
        cursor: isEditing
          ? 'pointer' : 'auto'
      }}
      accept='image/jpeg, image/png, image/gif'
      onDrop={(accepted, rejected) => {
        if (accepted.length) {
          const file = accepted[0]
          if (file.size && file.size > 6200000) {
            onChange({
              errors: {
                portrait: t('profile/portrait/tooBig')
              }
            })
            return
          }
          readFile(file)
            .then(({content, url}) => {
              onChange({
                values: {
                  portrait: content,
                  portraitPreview: url
                },
                errors: {
                  portrait: undefined
                }
              })
            })
            .catch(() => {
              onChange({
                errors: {
                  portrait: t('profile/portrait/readError')
                }
              })
            })
        } else if (rejected.length) {
          onChange({
            errors: {
              portrait: t('profile/portrait/invalidType')
            }
          })
        }
      }}
    >
      {img}
      {note && <div {...styles.note}>
        {note}
      </div>}
    </Dropzone>
  )
})
