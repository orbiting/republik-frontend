import React from 'react'
import { css } from 'glamor'
import { Interaction } from '@project-r/styleguide'
import Goodie from './Goodie'
import FieldSet from '../../FieldSet'

type GoodieRewardType = {
  __typename: 'Goodie'
  id: string
  name: 'FONDUE' | 'NOTEBOOK' | 'MASK' | 'TABLEBOOK'
}

export type PledgeOptionType = {
  reward: GoodieRewardType
  __typename: 'PackageOption'
  accessGranted: boolean
  defaultAmount: number
  id: string
  maxAmount: number
  minAmount: number
  price: number
  templateId: string
  userPrice: boolean
}

export type FieldType = {
  default: number
  key: string
  max: 1
  min: 0
  option: PledgeOptionType
}

type FieldsType = {
  fields: FieldType[]
  values: Record<string, number>
  onChange: (fields) => void
  t: (string: string) => void
}

const styles = {
  goodieContainer: css({ marginBottom: 24 }),
  delivery: css({ marginBottom: 24 })
}

function GoodieOptions({ fields, values, onChange, t }: FieldsType) {
  if (!fields.length) {
    return null
  }

  return (
    <>
      <Interaction.H3>Zusätzliche Angebote</Interaction.H3>

      <div {...styles.goodieContainer}>
        {fields.map(field => {
          const onFieldChange = (_, value, shouldValidate) => {
            let error
            const nextFields = FieldSet.utils.fieldsState({
              field: field.key,
              value,
              error,
              dirty: shouldValidate
            })
            onChange(nextFields)
          }
          const value =
            values[field.key] === undefined ? field.default : values[field.key]

          return (
            <Goodie
              key={field.key}
              option={field.option}
              value={value}
              onChange={value => onFieldChange(undefined, value, false)}
              t={t}
            />
          )
        })}
      </div>
    </>
  )
}

export default GoodieOptions
