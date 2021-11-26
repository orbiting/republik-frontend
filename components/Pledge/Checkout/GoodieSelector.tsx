import React from 'react'
import { css } from 'glamor'

import { Field, Label, mediaQueries, fontStyles } from '@project-r/styleguide'

const goodies = [
  {
    label: 'Republik Mitgliedschaft als Geschenk',
    price: 24000,
    minAmount: 1,
    maxAmount: 100,
    defaultAmount: 1
  },
  {
    label: 'Notebook',
    price: 2000,
    image:
      'https://cdn.repub.ch/frontend/static/packages/moleskine_totebag_dark.png',
    minAmount: 0,
    maxAmount: 100,
    defaultAmount: 0
  },
  {
    label: 'Tasche',
    price: 2000,
    image:
      'https://cdn.repub.ch/frontend/static/packages/moleskine_totebag_dark.png',
    minAmount: 0,
    maxAmount: 100,
    defaultAmount: 0
  }
]

type GoodieType = {
  label: string
  price: number
  minAmount: number
  maxAmount: number
  defaultAmount: number
  image?: string
}

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    [mediaQueries.mUp]: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }),
  description: css({
    padding: '0px 0px 8px 0px',
    [mediaQueries.mUp]: {
      padding: '0px 8px 0px 0px'
    }
  }),
  title: css({
    ...fontStyles.sansSerifMedium18,
    margin: '0 0 4px'
  }),
  goodieImage: css({
    display: 'block',
    height: 52,
    marginRight: 16
  }),
  details: css({
    display: 'flex'
  }),
  amount: css({
    flexShrink: 1,
    [mediaQueries.mUp]: {
      maxWidth: 80
    }
  })
}

const GoodieSelector = ({ xmemberships, onSelect }) => {
  return (
    <>
      <h3>Goodies</h3>
      {goodies.map((goodie: GoodieType) => (
        <div {...styles.container} key={goodie.label}>
          <div {...styles.details}>
            {goodie.image && <img src={goodie.image} {...styles.goodieImage} />}
            <div {...styles.description}>
              <p {...styles.title}>{goodie.label}</p>
              <Label>{`CHF ${goodie.price / 100} pro ${
                goodie.minAmount === 1 ? 'Jahr' : 'Stück'
              } `}</Label>
            </div>
          </div>
          <div {...styles.amount}>
            <Field label='Anzahl' value={goodie.defaultAmount}>
              {goodie.price}
            </Field>
          </div>
        </div>
      ))}
    </>
  )
}

export default GoodieSelector
