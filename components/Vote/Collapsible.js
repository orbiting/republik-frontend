import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor';
import ChevronRightIcon from 'react-icons/lib/md/chevron-right'
import ChevronDownIcon from 'react-icons/lib/md/expand-more'

const styles = {
  wrapper: css({
    marginTop: 15,
  }),
  toggle: css({
    cursor: 'pointer',
  }),
  body: css({
    marginTop: 10,
    marginLeft: 15,
  }),
}


class Collapsible extends React.Component {

  state = {
    collapsed: true
  }

  toggleCollapsed = () => {
    this.setState(({collapsed}) => ({
      collapsed: !collapsed
    }))
  }

  render() {

    const { label, labelExpanded, children } = this.props
    const { collapsed } = this.state

    return (
      <div {...styles.wrapper}>
        <div {...styles.toggle} onClick={this.toggleCollapsed}>
          { collapsed
              ? <ChevronRightIcon />
              : <ChevronDownIcon />
          }
          { collapsed
              ? label
              : labelExpanded
          }
        </div>
        { collapsed || 
          <div {...styles.body}>
            {
              children
            }
          </div>
        }
      </div>
    )
  }
}

Collapsible.propTypes = {
  label: PropTypes.string,
}

Collapsible.defaultProps = {
  label: 'Weitere Informationen',
  labelExpanded: 'Weitere Informationen',
}

export default Collapsible