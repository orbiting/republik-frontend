import React from 'react'
import { css } from 'glamor'
import { useColorContext } from '@project-r/styleguide/lib/components/Colors/ColorContext'

const styles = {
  table: css({
    padding: 2,
    '& > th': {
      borderBottomStyle: 'solid',
      borderBottomWidth: '1'
    }
  }),
  header: css({
    '& > tr > *': {
      textAlign: 'left',
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      paddingRight: 4
    }
  }),
  body: css({})
}

const Table = ({ headers, data }) => {
  const [colorScheme] = useColorContext()

  return (
    <table {...styles.table}>
      <thead {...styles.header}>
        <tr>
          {headers.map(header => (
            <th key={header.key} {...colorScheme.set('borderColor', 'text')}>
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(dataSet => (
          <tr key={Symbol(dataSet).toString()}>
            {headers.map(heading => (
              <td key={Symbol(dataSet).toString()}>
                {heading.render
                  ? heading.render(dataSet)
                  : dataSet[heading.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
