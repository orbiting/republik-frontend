import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import Head from 'next/head'
import Router from 'next/router'

import Loader from '../Loader'

const styles = {
  img: css({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%'
  })
}

class Image extends Component {
  tick () {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(
      () => {
        this.next()
        this.tick()
      },
      this.props.duration
    )
  }
  next () {
    const { statement, query, error } = this.props
    if (error && !query.sequenceNumber) {
      console.error(error)
      return
    }
    const to = {
      pathname: '/community',
      query: {
        ...query,
        sequenceNumber: error
          ? undefined
          : statement && statement.sequenceNumber
      }
    }
    Router.push(to, to, { shallow: true })
  }
  componentDidMount () {
    this.tick()
  }
  componentWillUnmount () {
    clearTimeout(this.timeout)
  }
  render () {
    const {
      statement,
      statement: {
        portrait, name, sequenceNumber
      }
    } = this.props

    return (
      <div>
        <Head>
          <meta name='robots' content='noindex' />
        </Head>
        <Loader loading={!statement} render={() => (
          <img {...styles.img}
            onDoubleClick={() => {
              this.next()
              this.tick()
            }}
            src={portrait}
            alt={`${sequenceNumber} – ${name}`} />
        )} />
      </div>
    )
  }
}

const query = gql`query aSequence($sequenceNumber: Int!, $orderDirection: OrderDirection!) {
  nextStatement(sequenceNumber: $sequenceNumber, orderDirection: $orderDirection) {
    id
    sequenceNumber
    name
    portrait(size: SHARE)
  }
}`

export default compose(
  graphql(query, {
    props: ({ data, ownProps: { name } }) => {
      return ({
        loading: data.loading,
        error: data.error,
        statement: data.nextStatement
      })
    }
  })
)(Image)
