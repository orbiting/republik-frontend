import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import {
  Loader,
  TeaserFrontTileRow,
  TeaserFrontTile,
  Label,
  fontStyles,
  Center,
  Breakout,
  useColorContext
} from '@project-r/styleguide'

import { Link } from '../../lib/routes'
import SectionTitle from './Common/SectionTitle'
import SectionContainer from './Common/SectionContainer'

const query = gql`
  query MarketingPage {
    employees(withBoosted: true, shuffle: 50) {
      title
      name
      group
      subgroup
      user {
        id
        portrait
        slug
        statement
      }
    }
  }
`

const Team = ({ data: { loading, employees } }) => {
  const [colorScheme] = useColorContext()
  return (
    <SectionContainer>
      <SectionTitle
        title='Wir sind ein Team'
        lead='Unsere Crew besteht aus kompetenten Profis. Den besten, die wir finden
          konnten. Uns eint die Leidenschaft für guten Journalismus.'
      />
      <Breakout size='breakout'>
        <Loader
          loading={loading}
          style={{ minHeight: 400 }}
          render={() => (
            <TeaserFrontTileRow autoColumns>
              {employees.slice(0, 3).map(employee => {
                return (
                  <TeaserFrontTile key={employee.name}>
                    <h3
                      {...styles.statement}
                    >{`«${employee.user.statement}»`}</h3>
                    <div {...styles.employee}>
                      <Link href={`~${employee.user.slug}`} passHref>
                        <a>
                          <img
                            {...styles.profilePicture}
                            src={employee.user.portrait}
                            alt=''
                          />
                        </a>
                      </Link>
                      <div {...styles.employeeText}>
                        <p {...styles.employeeName}>{employee.name}</p>
                        <Label {...colorScheme.set('color', 'disabled')}>
                          {employee.title}
                        </Label>
                      </div>
                    </div>
                  </TeaserFrontTile>
                )
              })}
            </TeaserFrontTileRow>
          )}
        />
      </Breakout>
    </SectionContainer>
  )
}

const styles = {
  profilePicture: css({
    display: 'block',
    width: 46,
    flex: `0 0 ${46}`,
    height: 46,
    marginRight: 8
  }),
  statement: css({
    ...fontStyles.serifTitle22
  }),
  employee: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  employeeText: css({
    textAlign: 'left'
  }),
  employeeName: css({
    ...fontStyles.sansSerifRegular18,
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
    margin: 0
  })
}

export default compose(graphql(query))(Team)
