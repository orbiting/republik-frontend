import React from 'react'
import Frame from '../Frame'
import withMe from '../../lib/apollo/withMe'
import Poll from './Poll'
import { compose } from 'react-apollo'
import withMembership from '../Auth/withMembership'

const TodoItem = ({ done, label, anchor }) => (
  <li>
    {done ? '👌' : '🙏'}
    <a href={`#${anchor}`}>{label}</a>
  </li>
)

class Page extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pollStatus: {
        statement: false,
        report: false,
        budget: false,
        president: false,
        council: false
      }
    }
  }

  render () {
    const meta = {
      title: 'Wahl des Genossenschaftsrats',
      description: 'Bestimme über die Zukunft der Republik!'
    }

    const { url } = this.props

    const options = [
      { value: 'yes', label: 'Ja' },
      { value: 'no', label: 'Nein' }
    ]

    return (
      <Frame meta={meta} url={url}>
        <div
          style={{ position: 'fixed', top: 100, left: 0, width: 250 }}
        >
          <div>Abstimmungen</div>
          <ul style={{ listStyle: 'none' }}>
            <TodoItem
              done={this.state.pollStatus.statement}
              label='Jahresrechung'
              anchor='jahresrechung'
            />
            <TodoItem
              done={this.state.pollStatus.report}
              label='Revisionsbericht'
              anchor='revisionsbericht'
            />
            <TodoItem
              done={this.state.pollStatus.budget}
              label='Budget'
              anchor='budget'
            />
          </ul>
        </div>

        <h1>Wahl- und Abstimmungsplattform 2018</h1>
        <h2>Abstimmungen</h2>

        <h3 id='jahresrechung'>Jahresrechung</h3>
        <Poll
          proposition='Wollen Sie die Jahresrechnung 2017 annehmen?'
          options={options}
          onFinish={() =>
            this.setState(({ pollStatus }) => ({
              pollStatus: { ...pollStatus, statement: true }
            }))
          }
        />

        <h3 id='revisionsbericht'>Revisionsbericht</h3>
        <Poll
          proposition='Wollen Sie den Revisionsbericht 2017 annehmen?'
          options={options}
          onFinish={() =>
            this.setState(({ pollStatus }) => ({
              pollStatus: { ...pollStatus, report: true }
            }))
          }
        />

        <h3 id='budget'>Budget</h3>
        <Poll
          proposition='Wollen Sie das Budget 2018 annehmen?'
          options={options}
          onFinish={() =>
            this.setState(({ pollStatus }) => ({
              pollStatus: { ...pollStatus, budget: true }
            }))
          }
        />

        <h2>Wahlen</h2>
        <h3>Präsidium</h3>
        <h3>Genossenschaftsrat</h3>
      </Frame>
    )
  }
}

export default compose(
  withMe,
  withMembership
)(Page)
