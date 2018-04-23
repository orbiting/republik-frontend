import React, { Fragment } from 'react'
import Head from 'next/head'
import { renderMdast } from 'mdast-react-render'

// convert string into array of slice arguments, see tests
export const parseSliceRanges = ranges => (
  ranges.split(':').map(range => {
    let [start, end] = range.split('...')
    start = +start || 0

    if (end === '') {
      end = undefined
    } else if (end === undefined) {
      end = start + 1
    } else {
      end = +end
    }

    return [start, end]
  })
)

export default ({schema, mdast, ranges}) => {
  const sliceNode = (tree, [[start, end], ...childRanges]) => {
    const children = tree.children.slice(start, end)

    return {
      ...tree,
      children: childRanges.length
        ? children.map(child => sliceNode(child, childRanges))
        : children
    }
  }

  const part = sliceNode(
    mdast, parseSliceRanges(ranges)
  )

  return (
    <Fragment>
      <Head>
        <meta name='robots' content='noindex' />
      </Head>
      {renderMdast(part, schema)}
    </Fragment>
  )
}
