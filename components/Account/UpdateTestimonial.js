import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo'
import { compose } from 'redux'
import { range } from 'd3-array'
import { css } from 'glamor'
import Link from 'next/link'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import ErrorMessage from '../ErrorMessage'
import FieldSet from '../FieldSet'
import Loader from '../Loader'
import RawHtml from '../RawHtml'

import { Item } from '../Testimonial/List'
import Detail from '../Testimonial/Detail'

import {
  InlineSpinner,
  Interaction,
  Button,
  A,
  linkRule
} from '@project-r/styleguide'

const { H2, P } = Interaction

const fields = t => [
  {
    label: t('testimonial/role/label'),
    name: 'role'
  },
  {
    label: t('testimonial/quote/label'),
    name: 'quote',
    autoSize: true,
    validator: value =>
      (!value.trim() && t('testimonial/quote/error')) ||
      (value.trim().length >= 140 && t('testimonial/quote/tooLong'))
  }
]

const styles = {
  previewImage: css({
    filter: 'grayscale(1)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%',
    display: 'block'
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
        content,
        url
      })
    })

    fileReader.addEventListener('error', (error) => {
      reject(error)
    })

    fileReader.readAsDataURL(file)
  })
}

const randomSeed = (length = 5) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  return range(length).map(() => {
    return possible.charAt(Math.floor(Math.random() * possible.length))
  }).join('')
}

class Testimonial extends Component {
  constructor (props) {
    super(props)
    this.state = {
      submitting: false,
      serverError: undefined,
      imageError: undefined,
      success: false,
      values: {},
      errors: {},
      dirty: {}
    }
  }
  onFile (e) {
    const {t} = this.props
    const file = e.target.files[0]
    if (file.type.indexOf('image/') === 0) {
      if (file.size && file.size > 4100000) {
        this.setState(() => ({
          imageError: t('testimonial/pickImage/tooBig')
        }))
        return
      }
      this.setState(() => ({
        imageError: ''
      }))
      readFile(file)
        .then(({content, url, filename}) => {
          this.setState(() => ({
            image: {
              content,
              url
            }
          }))
        })
        .catch(() => {
          this.setState(() => ({
            imageError: t('testimonial/pickImage/readError')
          }))
        })
    } else {
      this.setState(() => ({
        imageError: t('testimonial/pickImage/invalidType')
      }))
    }
  }
  submit () {
    const {values, image} = this.state

    this.setState(() => ({
      submitting: true,
      success: false,
      serverError: undefined
    }))

    this.props.submit({
      role: values.role,
      quote: values.quote,
      image: image ? image.content : undefined
    })
      .then(() => {
        // give keycdn a few seconds to pruge image
        // https://www.keycdn.com/support/purge-cdn-cache/
        setTimeout(() => {
          this.setState(() => ({
            submitting: false,
            success: true,
            image: undefined,
            imageHash: randomSeed(),
            dirty: {}
          }))
          // reload image again just in case
          setTimeout(() => {
            this.setState(() => ({
              imageHash: randomSeed()
            }))
          }, 5000)
        }, 3000)
      })
      .catch(error => {
        this.setState(() => ({
          submitting: false,
          serverError: error
        }))
      })
  }
  updateFields (props) {
    this.setState((state) => {
      const testimonial = props.testimonial || {}
      const values = {
        ...state.values,
        quote: testimonial.quote || '',
        role: testimonial.role || ''
      }
      const errors = FieldSet.utils.getErrors(
        fields(props.t),
        values
      )

      return {
        values,
        errors: {
          ...state.errors,
          ...errors
        }
      }
    })
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.testimonial !== this.props.testimonial) {
      this.updateFields(nextProps)
    }
  }
  componentDidMount () {
    this.updateFields(this.props)
  }
  render () {
    const {t, loading, error, testimonial, me} = this.props
    const {
      values, dirty, errors,
      submitting,
      serverError,
      image, imageHash
    } = this.state

    const imageSrc = image
      ? image.url
      : testimonial && `${testimonial.image}${imageHash ? `?${imageHash}` : ''}`
    const imageMissing = !imageSrc && t('testimonial/pickImage/empty')
    const imageError = this.state.imageError || (dirty.image && imageMissing)

    const errorMessages = Object.keys(errors)
      .map(key => errors[key])
      .concat(imageMissing)
      .filter(Boolean)

    const showDetail = !!(values.quote || '').trim()
    const pickImage = (event) => {
      event.preventDefault()
      this.fileInput.value = null
      this.fileInput.click()
    }

    // video testimonials are imported
    // and can't be edited here
    if (testimonial && testimonial.video) {
      return null
    }

    const isDirty = (
      image ||
      Object.keys(dirty).map(key => dirty[key])
        .filter(Boolean).length
    )
    const unpublished = !!(testimonial && testimonial.adminUnpublished)

    return (
      <Loader loading={loading} error={error} render={() => (
        <div style={{marginBottom: 40}}>
          <H2>{t('testimonial/title')}</H2>
          <RawHtml type={P} dangerouslySetInnerHTML={{
            __html: t('testimonial/description')
          }} />
          <form onSubmit={event => {
            event.preventDefault()
            if (errorMessages.length) {
              this.setState((state) => ({
                dirty: {
                  ...state.dirty,
                  quote: true,
                  role: true,
                  image: true
                }
              }))
              return
            }
            this.submit()
          }}>
            <br />
            <input
              type='file'
              accept='image/*'
              ref={ref => { this.fileInput = ref }}
              onChange={event => this.onFile(event)}
              style={{display: 'none'}}
            />
            {!imageSrc && (
              <Button onClick={pickImage}>
                {t('testimonial/pickImage')}
              </Button>
            )}
            {!!imageSrc && <A href='#' onClick={pickImage}>
              {t('testimonial/pickImage/update')}
            </A>}
            <br />
            {!!imageError && <ErrorMessage error={imageError} />}
            <br />
            {!!imageSrc && (
              <div>
                <div style={{width: 150, float: 'left'}}>
                  <Item
                    style={{width: '100%', marginLeft: -5, cursor: 'default'}}
                    name={me.name}
                    imageRenderer={() => (
                      <div {...styles.previewImage} style={{
                        backgroundImage: `url(${imageSrc})`
                      }} />
                    )}
                    isActive={showDetail} />
                </div>
                <div style={{width: 'calc(100% - 150px)', float: 'left'}}>
                  <FieldSet
                    values={values}
                    errors={errors}
                    dirty={dirty}
                    fields={fields(t)}
                    onChange={(fields) => {
                      this.setState((state) => {
                        const next = FieldSet.utils.mergeFields(fields)(state)
                        if (
                          next.values.quote &&
                          next.values.quote.trim().length
                        ) {
                          next.dirty = {
                            ...next.dirty,
                            quote: true
                          }
                        }
                        return next
                      })
                    }} />
                </div>
                <br style={{clear: 'both'}} />
                {showDetail && (
                  <Detail t={t}
                    share={testimonial && testimonial.published && !isDirty}
                    data={{
                      id: testimonial && testimonial.id,
                      userId: testimonial && testimonial.userId,
                      name: me.name,
                      role: values.role,
                      quote: values.quote
                    }} />
                )}
              </div>
            )}
            <br style={{clear: 'both'}} />
            <br />

            {unpublished && <ErrorMessage error={t('testimonial/unpublished')} />}
            {!!serverError && <ErrorMessage error={serverError} />}
            {
              !!imageSrc && (
                submitting
                ? <InlineSpinner />
                : (
                  <div style={{opacity: errorMessages.length ? 0.5 : 1}}>
                    <Button type='submit'>
                      {testimonial && testimonial.published
                        ? t('testimonial/update')
                        : t('testimonial/submit')
                      }
                    </Button>
                  </div>
                )
              )
            }
            {testimonial && testimonial.published && (
              <div style={{marginTop: 20}}>
                <Link href={`/community?id=${testimonial.id}`}>
                  <a {...linkRule}>
                    {t('testimonial/viewLive')}
                  </a>
                </Link>
                {' – '}
                <A href='#' onClick={(e) => {
                  e.preventDefault()
                  this.props.unpublish()
                }}>
                  {t('testimonial/unpublish/user')}
                </A>
              </div>
            )}
            {testimonial && !testimonial.published && (
              <ErrorMessage error={t('testimonial/unpublished/user')} />
            )}
          </form>
        </div>
      )} />
    )
  }
}

const submitMutation = gql`mutation submitTestimonial($role: String!, $quote: String!, $image: String) {
  submitTestimonial(role: $role, quote: $quote, image: $image) {
    id
  }
}`
const unpublishMutation = gql`mutation unpublishTestimonial {
  unpublishTestimonial
}`

export const query = gql`
  query myTestimonial {
    me {
      id
      name
      publicUser {
        id
        name
        email
        testimonial {
          id
          userId
          name
          role
          quote
          image
          smImage
          published
          adminUnpublished
          video {
            hls
            mp4
            youtube
          }
        }
      }
    }
  }
`

export default compose(
  graphql(unpublishMutation, {
    props: ({ mutate }) => ({
      unpublish: () =>
        mutate({
          refetchQueries: [
            {
              query
            }
          ]
        })
    })
  }),
  graphql(submitMutation, {
    props: ({ mutate }) => ({
      submit: variables =>
        mutate({
          variables,
          refetchQueries: [
            {
              query
            }
          ]
        })
    })
  }),
  graphql(query, {
    props: ({ data }) => ({
      loading: data.loading,
      error: data.error,
      testimonial: data.loading
        ? undefined
        : data.me && data.me.publicUser && data.me.publicUser.testimonial
    })
  }),
  withT,
  withMe
)(Testimonial)
