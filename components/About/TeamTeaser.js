import React from 'react'
import Employees from '../Imprint/Employees'

const EmployeesRow = props => <Employees filter={Boolean} {...props} />

EmployeesRow.defaultProps = {
  shuffle: 12,
  withBoosted: true,
  minColumns: 3,
  maxColumns: 4
}

export default EmployeesRow
