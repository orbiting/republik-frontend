import React from 'react'
import Employees from '../Imprint/Employees'
import { A, Interaction, mediaQueries } from '@project-r/styleguide'
import { css } from 'glamor'
import HrefLink from '../Link/Href'

const styles = {
  h3: css({
    marginTop: 30,
    [mediaQueries.mUp]: {
      marginTop: 60
    },
    marginBottom: 20
  })
}

const EmployeesRow = () => (
  <Employees
    shuffle={4}
    withBoosted={true}
    filter={Boolean}
    singleRow={true}
    minColumns={3}
    maxColumns={4}
  />
)

const TeamTeaser = ({ title, link }) => (
  <div>
    <Interaction.H3 {...styles.h3}>{title}</Interaction.H3>
    <EmployeesRow />
    {link && (
      <div style={{ marginTop: 10 }}>
        <HrefLink href={link.path} passHref>
          <A>{link.label}</A>
        </HrefLink>
      </div>
    )}
  </div>
)

export default TeamTeaser
