import React, { Fragment } from 'react'
import { CustomElement, CustomText } from '../../custom-types'
import { config as elConfig } from '../../elements'
import { Element as SlateElement } from 'slate'

const DataForms: React.FC<{
  nodes: (CustomElement | CustomText)[]
  setNodes: (n: (CustomElement | CustomText)[]) => void
}> = ({ nodes, setNodes }) => {
  return (
    <div>
      {nodes.map((node, i) => {
        if (!SlateElement.isElement(node)) return null
        const DataForm = elConfig[node.type].DataForm
        const setElement = (element: CustomElement) =>
          setNodes(nodes.map((n, j) => (j === i ? element : n)))
        return (
          <Fragment key={i}>
            {DataForm ? (
              <DataForm element={node} setElement={setElement} />
            ) : null}
            <DataForms
              nodes={node.children}
              setNodes={n => setElement({ ...node, children: n })}
            />
          </Fragment>
        )
      })}
    </div>
  )
}

export default DataForms
