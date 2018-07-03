import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'

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
    search(filter: { type: User, ids: $ids }) {
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

const groupBy = (array, key) => {
  return array
    ? array.reduce((map, obj) => {
      if (map[obj[key]]) {
        map[obj[key]].group.push(obj)
      } else {
        map[obj[key]] = {
          group: [obj]
        }
      }
      return map
    }, {})
    : {}
}

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

        const userById = [...nodes].reduce((map, node) => {
          map[node.entity.id] = node.entity
          return map
        }, {})

        return (
          <div {...styles.container}>
            {Object.keys(employeeGroups).map((groupKey, i) => (
              <section {...styles.group} key={i}>
                <H2 {...styles.groupHeading}>{groupKey}</H2>
                {!!employeeGroups[groupKey] &&
                  !employeeGroups[groupKey].group &&
                  Object.keys(employeeGroups[groupKey]) &&
                  Object.keys(employeeGroups[groupKey]).map((subgroupKey, i) => (
                    <section {...styles.subgroup} key={i}>
                      <H3 {...styles.subgroupHeading}>{subgroupKey}</H3>
                      {!!employeeGroups[groupKey][subgroupKey].group &&
                        employeeGroups[groupKey][subgroupKey].group.map((employee, i) => (
                          <Employee
                            {...employee}
                            {...userById[employee.userId]}
                            key={i}
                          />
                        ))}
                    </section>
                  ))}
                {!!employeeGroups[groupKey] &&
                  employeeGroups[groupKey].group &&
                  employeeGroups[groupKey].group.map((employee, i) => (
                    <Employee {...employee} {...userById[employee.userId]} key={i} />
                  ))}
              </section>
            ))}
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

      // Create a nested object with keys being group names and values being either:
      // - a {list: [...]} object containing an array of employees, or
      // - keys of subgroups names pointing to a {list: [...]} object
      const firstLevelGroups = groupBy(employees, 'group')
      let employeeGroups = {}
      for (var property in firstLevelGroups) {
        if (firstLevelGroups.hasOwnProperty(property)) {
          employeeGroups[property] =
            firstLevelGroups[property].group.length &&
            !!firstLevelGroups[property].group[0].subgroup
              ? groupBy(firstLevelGroups[property].group, 'subgroup')
              : firstLevelGroups[property]
        }
      }

      return (
        <EmployeeList ids={uniqueUserIds} employeeGroups={employeeGroups} />
      )
    }}
  />
))

export default Employees
