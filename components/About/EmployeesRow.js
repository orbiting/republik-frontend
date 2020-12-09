import React from 'react'
import Employees from '../Imprint/Employees'

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

export default EmployeesRow
