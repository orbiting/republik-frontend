import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import { entries, nest } from 'd3-collection'

import Employee from './Employee'
import Loader from '../Loader'
import {
  Interaction,
  mediaQueries
} from '@project-r/styleguide'

const { H2, H3 } = Interaction

const clearfixStyle = {
  // Micro clearfix hack.
  '&::before': {
    content: ' ',
    display: 'table'
  },
  '&::after': {
    content: ' ',
    display: 'table',
    clear: 'both'
  }
}

const styles = {
  container: css({
    marginBottom: 30,
    [mediaQueries.mUp]: {
      marginBottom: 50
    }
  }),
  group: css({
    ...clearfixStyle,
    marginTop: 30,
    [mediaQueries.mUp]: {
      marginTop: 50
    }
  }),
  subgroup: css({
    ...clearfixStyle,
    marginTop: 10,
    [mediaQueries.mUp]: {
      marginTop: 20
    }
  }),
  groupHeading: css({
    marginBottom: 10,
    [mediaQueries.mUp]: {
      marginBottom: 20
    }
  }),
  subgroupHeading: css({
    margin: '5px 0',
    [mediaQueries.mUp]: {
      margin: '10px 0'
    }
  })
}

const getEmployeesGsheet = gql`
  query {
    employees {
      userId
      group
      subgroup
      name
      title
    }
  }
`

const getEmployeesData = gql`
  query getEmployeesData($ids: [ID!]) {
    search(filter: { type: User, ids: $ids }, first: 100) {
      nodes {
        entity {
          ... on User {
            id
            portrait
            username
          }
        }
      }
    }
  }
`

const EmployeeList = compose(
  graphql(getEmployeesData, {
    options: props => ({
      variables: {
        ids: props.ids
      }
    })
  })
)(({ employeeGroups, data: { loading, error, search } }) => {
  return (
    <Loader
      loading={loading}
      error={error}
      render={() => {
        const { nodes } = search

        const userById = nest()
          .key(d => d['entity']['id'])
          .rollup(d => d[0]['entity'])
          .object(nodes)

        const renderEmployee = (employee, i) =>
          <Employee
            {...employee}
            {...userById[employee.userId]}
            key={i}
          />

        return (
          <div {...styles.container}>
            {
              entries(employeeGroups).map(group =>
                <section {...styles.group} key={group.key}>
                  <H2 {...styles.groupHeading}>{group.key}</H2>
                  { group.value.group
                    ? group.value.group.map(renderEmployee)
                    : entries(group.value).map(subgroup => (
                      <section {...styles.subgroup} key={subgroup.key}>
                        <H3 {...styles.subgroupHeading}>{subgroup.key}</H3>
                        {subgroup.value.map(renderEmployee)}
                      </section>
                    ))
                  }
                </section>
              )
            }
          </div>
        )
      }}
    />
  )
})

const Employees = compose(
  graphql(getEmployeesGsheet, {})
)(({ data: { loading, error, employees } }) => (
  <Loader
    loading={loading}
    error={error}
    render={() => {
      const uniqueUserIds = [
        ...new Set(
          employees.map(employee => {
            return employee.userId
          })
        )
      ].filter(Boolean)

      const employeeGroups = nest()
        .key(d => d['group'])
        .key(d => d['subgroup'] || 'group')
        .object(employees)

      return (
        <EmployeeList ids={uniqueUserIds} employeeGroups={employeeGroups} />
      )
    }}
  />
))

export default Employees
