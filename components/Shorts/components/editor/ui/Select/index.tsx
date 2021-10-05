import React from 'react'
import { CustomElement } from '../../../../custom-types'
import TemplatePicker from './Templates'
import Drafts from './Drafts'

const Select: React.FC<{
  setValue: (t: CustomElement[]) => void
  setLocalStorageId: (id: string) => void
}> = ({ setValue, setLocalStorageId }) => (
  <>
    <TemplatePicker setValue={setValue} />
    <Drafts setValue={setValue} setLocalStorageId={setLocalStorageId} />
  </>
)

export default Select
