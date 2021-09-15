import React from 'react'
import { CustomElement } from '../../../custom-types'
import TemplatePicker from './Templates'
import Drafts from './Drafts'

const Select: React.FC<{
  setInitValue: (t: CustomElement[]) => void
  setLocalStorageId: (id: string) => void
}> = ({ setInitValue, setLocalStorageId }) => (
  <>
    <TemplatePicker setInitValue={setInitValue} />
    <Drafts setInitValue={setInitValue} setLocalStorageId={setLocalStorageId} />
  </>
)

export default Select
