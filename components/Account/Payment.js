import * as React from 'react'
import { chfFormat, timeFormat } from '../../lib/utils/format'
import { A } from '@project-r/styleguide'
import { useState } from 'react'
import withT from '../../lib/withT'
import { compose } from 'react-apollo'
import { css } from 'glamor'

const dayFormat = timeFormat('%d. %B %Y')
const hourFormat = timeFormat('%H:%M')

const styles = {
  item: css({
    '& td': {
      padding: '10px 10px 10px 0'
    }
  })
}

const Payment = ({ payment, t }) => {
  const [open, setOpen] = useState(false)
  const packageText = t(`package/${payment.name}/title`)

  return (
    <>
      <tr {...styles.item}>
        <td>{dayFormat(new Date(payment.createdAt))}</td>
        <td>{packageText}</td>
        <td>{chfFormat(payment.total / 100)}</td>
        <td>
          <A onClick={() => setOpen(!open)}>Details</A>
        </td>
      </tr>
      {open && (
        <tr {...styles.item}>
          <td colSpan='4'>
            {/* TODO use t function for texts */}
            Produkt: {packageText}, Erstellt am{' '}
            {dayFormat(new Date(payment.createdAt))} um{' '}
            {hourFormat(new Date(payment.createdAt))}
            <br />
            <br />
            Zahlungsart: {t(`account/pledges/payment/method/${payment.method}`)}
          </td>
        </tr>
      )}
    </>
  )
}

export default compose(withT)(Payment)
