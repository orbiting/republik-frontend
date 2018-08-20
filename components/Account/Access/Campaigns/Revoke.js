import React, { Component, Fragment } from 'react'

import { A } from '@project-r/styleguide'

class Revoke extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      error: false,
      mutating: false,
      mutationError: null
    }

    this.hasMutated = () => {
      this.setState({
        mutating: false
      })
    }

    this.catchMutationError = error => {
      this.setState({
        mutating: false,
        mutationError: error
      })
    }

    this.onClickRevoke = (event) => {
      event.preventDefault()

      return this.props.revokeAccess({
        id: this.props.grant.id
      })
        .then(this.hasMutated)
        .catch(this.catchMutationError)
    }
  }

  render () {
    const { mutationError } = this.state

    if (mutationError) {
      return (<Fragment>Zurückziehen: Das hat nicht geklappt.</Fragment>)
    }

    return (
      <A href='#' onClick={this.onClickRevoke}>Zurückziehen</A>
    )
  }
}

export default Revoke
