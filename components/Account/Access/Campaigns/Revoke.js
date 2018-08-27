import React, { Component, Fragment } from 'react'

import { A, InlineSpinner } from '@project-r/styleguide'

class Revoke extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      error: false,
      isMutating: false,
      mutationError: null
    }

    this.hasMutated = () => {
      this.setState({
        isMutating: false
      })
    }

    this.catchMutationError = error => {
      this.setState({
        isMutating: false,
        mutationError: error
      })
    }

    this.onClickRevoke = (event) => {
      event.preventDefault()

      this.setState({
        isMutating: true,
        mutationError: false
      })

      return this.props.revokeAccess({
        id: this.props.grant.id
      })
        .then(this.hasMutated)
        .catch(this.catchMutationError)
    }
  }

  render () {
    const { isMutating, mutationError } = this.state

    if (mutationError) {
      return (<Fragment>Zurückziehen: Das hat nicht geklappt.</Fragment>)
    }

    return (
      <div style={{height: 25}}>
        {isMutating
          ? <InlineSpinner size={25} />
          : <A href='#' onClick={this.onClickRevoke}>
            Zugriff löschen
          </A>
        }
      </div>
    )
  }
}

export default Revoke
