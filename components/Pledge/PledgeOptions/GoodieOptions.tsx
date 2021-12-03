import React from 'react'
import { css } from 'glamor'
import { Interaction, Label } from '@project-r/styleguide'
import Goodie from './Goodie'
import FieldSet, { styles as fieldSetStyles } from '../../FieldSet'

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
  onChange: (fields) => void
  t: (string: string) => void
}

const styles = {
  goodieContainer: css({ marginBottom: 24 }),
  delivery: css({ marginBottom: 24 })
}

function GoodieOptions({ fields, onChange, t }: FieldsType) {
  if (!fields) {
    return null
  }

  console.log(fields)
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

          return (
            <Goodie
              key={field.key}
              option={field.option}
              onChange={value => onFieldChange(undefined, value, false)}
              t={t}
            />
          )
        })}
      </div>
      <div {...styles.delivery}>
        <Label>{t('pledge/notice/goodies/delivery')}</Label>
      </div>
    </>
  )
}

export default GoodieOptions
