import * as React from 'react'
import { chfFormat, timeFormat } from '../../lib/utils/format'
import { AnchorLink } from './Anchors'
import { A, useColorContext } from '@project-r/styleguide'
import { useState } from 'react'
import withT from '../../lib/withT'
import { compose } from 'react-apollo'

const dayFormat = timeFormat('%d. %B %Y')

const styles = {
  item: {}
}

const Payment = ({ payment, t }) => {
  const [open, setOpen] = useState(false)
  //const [colorScheme] = useColorContext()

  return (
    <>
      <tr /*...colorScheme.set('backgroundColor', 'textSoft')*/>
        <td>{dayFormat(new Date(payment.createdAt))}</td>
        <td>{t(`package/${payment.name}/title`)}</td>
        <td>{chfFormat(payment.total / 100)}</td>
        <td>
          <A onClick={() => setOpen(!open)}>Details</A>
        </td>
      </tr>
      {open && (
        <tr>
          <p>Hello</p>
        </tr>
      )}
    </>
  )
}

export default compose(withT)(Payment)
