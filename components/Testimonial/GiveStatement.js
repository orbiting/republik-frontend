import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Link from 'next/link'

import withT from '../../lib/withT'
import { PUBLIC_BASE_URL, ASSETS_SERVER_BASE_URL } from '../../lib/constants'

import ErrorMessage from '../ErrorMessage'
import Loader from '../Loader'
import FieldSet from '../FieldSet'

import { Item } from './List'

import ActionBar from '../ActionBar'

import {
  Interaction, Button, A, linkRule, InlineSpinner, Label
} from '@project-r/styleguide'

const { H2, P } = Interaction

const fields = (t) => [
  {
    label: t('profile/statement/label'),
    name: 'statement',
    autoSize: true,
    validator: (value) => (
      (
        !value.trim() &&
        t('profile/statement/error')
      ) ||
      (
        value.trim().length >= 140 &&
        t('profile/statement/tooLong')
      )
    )
  }
]

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

class GiveStatement extends Component {
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
    const { t } = this.props
    const file = e.target.files[0]
    if (file.type.indexOf('image/') === 0) {
      if (file.size && file.size > 4100000) {
        this.setState(() => ({
          imageError: t('profile/portrait/tooBig')
        }))
        return
      }
      this.setState(() => ({
        imageError: ''
      }))
      readFile(file)
        .then(({ content, url, filename }) => {
          this.setState(() => ({
            image: {
              content,
              url
            }
          }))
        })
        .catch(() => {
          this.setState(() => ({
            imageError: t('profile/portrait/readError')
          }))
        })
    } else {
      this.setState(() => ({
        imageError: t('profile/portrait/invalidType')
      }))
    }
  }
  submit () {
    const { values, image } = this.state

    this.setState({
      submitting: true,
      success: false,
      serverError: undefined
    })

    this.props.update({
      statement: values.statement,
      isListed: true,
      portrait: image ? image.content : undefined
    })
      .then(() => {
        this.setState(() => ({
          submitting: false,
          success: true,
          image: undefined,
          dirty: {}
        }))
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
      const data = props.data || {}
      const values = {
        ...state.values,
        statement: data.statement || ''
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
    if (nextProps.data !== this.props.data) {
      this.updateFields(nextProps)
    }
  }
  componentDidMount () {
    this.updateFields(this.props)
  }
  render () {
    const { t, loading, error, data, pkg } = this.props
    const {
      values, dirty, errors,
      submitting,
      serverError,
      image
    } = this.state

    const imageSrc = image
      ? image.url
      : data && data.portrait
    const imageMissing = !imageSrc && t('profile/portrait/empty')
    const imageError = this.state.imageError || (dirty.image && imageMissing)

    const errorMessages = Object.keys(errors)
      .map(key => errors[key])
      .concat(imageMissing)
      .filter(Boolean)

    const showDetail = !!(values.statement || '').trim()
    const pickImage = (event) => {
      event.preventDefault()
      this.fileInput.value = null
      this.fileInput.click()
    }

    const adminUnpublished = !!(data && data.isAdminUnlisted)

    const updateSuffix = data && data.isListed ? '/update' : ''

    return (
      <Loader loading={loading} error={error} render={() => (
        <div style={{ marginBottom: 40 }}>
          <H2>{t(`statement/title${updateSuffix}`)}</H2>
          <P>{t(`statement/description${updateSuffix}`)}</P>
          <form onSubmit={event => {
            event.preventDefault()
            if (errorMessages.length) {
              this.setState((state) => ({
                dirty: {
                  ...state.dirty,
                  statement: true,
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
              style={{ display: 'none' }}
            />
            {!imageSrc && (
              <Button onClick={pickImage}>
                {t('profile/portrait/choose')}
              </Button>
            )}
            {!!imageSrc && <A href='#' onClick={pickImage}>
              {t('profile/portrait/update')}
            </A>}
            <br />
            {!!imageError && <ErrorMessage error={imageError} />}
            <br />
            {!!imageSrc && (
              <div>
                <div style={{ width: 150, float: 'left' }}>
                  <Item
                    style={{ width: '100%', marginLeft: -5, cursor: 'default' }}
                    name={data.name}
                    previewImage={image && image.url}
                    image={data.portrait}
                    isActive={showDetail} />
                </div>
                <div style={{ width: 'calc(100% - 150px)', float: 'left' }}>
                  <FieldSet
                    values={values}
                    errors={errors}
                    dirty={dirty}
                    fields={fields(t)}
                    onChange={(fields) => {
                      this.setState((state) => {
                        const next = FieldSet.utils.mergeFields(fields)(state)
                        if (
                          next.values.statement &&
                          next.values.statement.trim().length
                        ) {
                          next.dirty = {
                            ...next.dirty,
                            statement: true
                          }
                        }
                        return next
                      })
                    }} />
                </div>
              </div>
            )}
            <br style={{ clear: 'both' }} />
            <br />

            {adminUnpublished && <ErrorMessage error={t('statement/adminUnpublished')} />}
            {!!serverError && <ErrorMessage error={serverError} />}
            {
              !!imageSrc && (
                submitting
                  ? <InlineSpinner />
                  : (
                    <div style={{ opacity: errorMessages.length ? 0.5 : 1 }}>
                      <Button type='submit'>
                        {t(`statement/submit${updateSuffix}`)}
                      </Button>
                    </div>
                  )
              )
            }
            {data && !data.isListed && data.statement && data.portrait && (
              <Label style={{ display: 'block', marginTop: 10 }}>{t('statement/unpublished')}</Label>
            )}
            {data && data.isListed && (
              <div style={{ marginTop: 20 }}>
                <Link href={`/community?id=${data.id}`}>
                  <a {...linkRule}>
                    {t('statement/viewLive')}
                  </a>
                </Link>
                {' – '}
                <A href='#' onClick={(e) => {
                  e.preventDefault()
                  this.props.update({
                    isListed: false
                  })
                }}>
                  {t('statement/unpublish')}
                </A>
                <br />
                <br />
                <P>
                  {t.first([
                    `statement/share/${pkg}/please`,
                    'statement/share/please'
                  ])}
                </P>
                <br />
                <ActionBar
                  url={pkg
                    ? `${PUBLIC_BASE_URL}/angebote?package=${pkg}&utm_campaign=${pkg}-STATEMENTS&utm_content=${data.id}`
                    : `${PUBLIC_BASE_URL}/community?id=${data.id}`}
                  title={t.first([
                    `statement/share/${pkg}/title`,
                    `statement/share/title`
                  ], data)}
                  emailSubject={t.first([
                    `statement/share/${pkg}/title`,
                    `statement/share/title`
                  ], data)}
                  download={`${ASSETS_SERVER_BASE_URL}/render?width=1200&height=628&updatedAt=${data.updatedAt}&url=${PUBLIC_BASE_URL}/community?share=${data.id}${pkg ? `&package=${pkg}` : ''}`}
                  shareOverlayTitle={t('statement/share/overlayTitle', data)}
                />
              </div>
            )}
          </form>
        </div>
      )} />
    )
  }
}

const updateMutation = gql`
mutation updateStatement($statement: String, $isListed: Boolean!, $portrait: String) {
  updateMe(statement: $statement, isListed: $isListed, portrait: $portrait) {
    id
    statement
    isListed
    portrait
    updatedAt
  }
}
`

const query = gql`
query myStatement {
  me {
    id
    name
    statement
    isListed
    isAdminUnlisted
    portrait
    updatedAt
  }
}`

export default compose(
  graphql(updateMutation, {
    props: ({ mutate }) => ({
      update: variables => mutate({
        variables
      })
    })
  }),
  graphql(query, {
    props: ({ data }) => ({
      loading: data.loading,
      error: data.error,
      data: data.loading ? undefined : data.me
    })
  }),
  withT
)(GiveStatement)
