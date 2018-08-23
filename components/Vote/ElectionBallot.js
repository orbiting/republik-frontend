import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor';
import { Checkbox, A, Editorial, Interaction, mediaQueries, colors, fontStyles } from '@project-r/styleguide';
import Radio from '@project-r/styleguide/lib/components/Form/Radio';
import ChevronRightIcon from 'react-icons/lib/md/chevron-right'
import ChevronDownIcon from 'react-icons/lib/md/expand-more'
import { userInfo } from 'os';

const { H1, H2, H3, P } = Interaction
const { Subhead } = Editorial

const DUMMY_STATEMENT = 'Nun, liebe Kinder, gebt fein acht, ich hab euch etwas mitgebracht. Dies ist das Statement eines Verlegers, genau einhundertvierzig Zeichen.'
const DUMMY_RECOMMENDATION = 'Wir empfehlen diese Kandidatin zur Wahl, weil sie mit ganzem Herzen bei der Sache ist.'
const DUMMY_YEAR = '1968'
const DUMMY_CREDENTIALS = 'Kindergärtnerin'
const DUMMY_REGION = 'Zürich'


const styles = {
  table: css({
    width: '100%',
    cursor: 'pointer',
  }),
  tableRow: css({
    position: 'relative',
    width: '100%',
    marginRight: 20,
  }),
  tableCell: css({

  }),
  statement: css({
    [mediaQueries.onlyS]: {
      ...fontStyles.serifBold19
    },
    ...fontStyles.serifBold24
  }),
  summaryWrapper: css({
  }),
  summary: css({
    width: '100%',
    minHeight: 20,
    display: 'flex',
    [mediaQueries.onlyS]: {
      '& :nth-child(1)': {
        width: '60%'
      },
      '& :nth-child(4)': {
        width: '40%',
        textAlign: 'right',
      },
      '& :nth-child(2), :nth-child(3)': {
        display: 'none'
      },
    },
    '& :nth-child(1)': {
      width: '30%'
    },
    '& :nth-child(3)': {
      width: '30%'
    },
    '& :nth-child(2), :nth-child(4)': {
      width: '20%'
    },
  }),
  summaryMobile: css({
    width: '100%',
    minHeight: 20,
    display: 'none',
    [mediaQueries.onlyS]: {
      display: 'flex',
      '& :nth-child(1)': {
        width: '60%'
      },
  
    },
  }),
  summaryLinks: css({
    width: '100%',
    minHeight: 20,
    display: 'flex',
    borderTop: '1px solid black',
    '& :nth-child(1)': {
      width: '60%'
    },  
  }),
  details: css({
    width: '100%',
    margin: '15px 0',
    '& > *': {
      margin: 3,
    },
    '& img': {
      width: 90,
      marginRight: 8,
      float: 'left',
    }
  }),
  wrapper: css({
    width: '100%',
    display: 'flex',
    padding: 5,
  }),
  wrapperSelected: css({
    background: colors.secondaryBg,
  }),
}

const Cell = ({children}) => 
  <div {...styles.tableCell}>
    {children}
  </div>

class ElectionBallot extends React.Component {

  state = {
    expanded: this.props.expandAll || false
  }

  toggleExpanded = (id) => {
    this.setState(({expanded}) => ({ 
      expanded: expanded === id
        ? null
        : id
    }))
  }

  render() {

    const { candidates, selected, allowMultiple, onChange, expandAll, disabled } = this.props
    const { expanded } = this.state

    const SelectionComponent = allowMultiple ? Checkbox : Radio

    return (
      <div {...styles.table}>
        { candidates
          .map((d, i) => {
            const showDetails = expandAll || expanded===d.id
            return (
              <div {...styles.wrapper} {...(showDetails && styles.wrapperSelected)}>
                <div 
                  onClick={e => { e.preventDefault(); this.toggleExpanded(d.id) }}
                >
                  {
                    showDetails 
                      ? <ChevronDownIcon/>
                      : <ChevronRightIcon />
                  }
                </div>
                <div 
                  {...styles.tableRow} 
                >
                  <div {...styles.summary} onClick={e => { e.preventDefault(); this.toggleExpanded(d.id) }}>
                    <Cell>
                      <A>{d.name}</A>
                    </Cell>
                    <Cell>
                      {DUMMY_YEAR}
                    </Cell>
                    <Cell>
                      {d.credentials.length > 0 &&
                      d.credentials.length[0] &&
                      d.credentials.length[0].description || DUMMY_CREDENTIALS}
                    </Cell>
                    <Cell>
                      {DUMMY_REGION}
                    </Cell>
                  </div>
                  { showDetails &&
                    <div {...styles.summaryWrapper}>
                      <div {...styles.summaryMobile}>
                        <Cell>
                          {DUMMY_YEAR}
                        </Cell>
                        <Cell>
                          {d.credentials.length > 0 &&
                          d.credentials.length[0] &&
                          d.credentials.length[0].description || DUMMY_CREDENTIALS}
                        </Cell>
                      </div>
                      <div {...styles.details}>
                        <div>
                          <img src='https://cdn.republik.space/s3/republik-assets/portraits/75d681a69882e54473eb4ec09b18f418.jpeg.webp?size=719x1280&resize=100x100&bw=true' />
                          <div {...styles.statement}>
                            {d.statement || DUMMY_STATEMENT}
                          </div>
                        </div>
                        <div style={{ clear: 'both' }}>
                          <Cell>
                            <A href={`/~${d.id}`}>Debatte</A>
                          </Cell>
                          <Cell>
                            <A href={`/~${d.id}`}>Profil</A>
                          </Cell>
                        </div>
                        <div>
                          {/* <img src='https://assets.project-r.construction/images/project_r_logo.svg' /> */}
                            Die Republik sagt: {DUMMY_RECOMMENDATION}
                        </div>
                      </div>
                    </div>
                  }
                </div>
                <div style={{width: 18}}>
                  <SelectionComponent
                    disabled={disabled}
                    checked={selected.findIndex(id => id===d.id)>-1} 
                    onChange={() => onChange(d.id)} 
                  />
                </div>
              </div>
            )
          })}
      </div>
    )
  }
}

ElectionBallot.propTypes = {
  candidates: PropTypes.array,
  selected: PropTypes.array,
  allowMultiple: PropTypes.bool,
  onChange: PropTypes.func,
  expandAll: PropTypes.bool,
  disable: PropTypes.bool,
}

ElectionBallot.defaultProps = {
  candidates: [],
  selected: [],
  allowMultiple: false,
  onChange: () => {},
  expandAll: false,
  disable: false,
}

export default ElectionBallot