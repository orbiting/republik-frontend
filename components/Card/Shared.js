import React from 'react'
import { css } from 'glamor'

import {
  Interaction
} from '@project-r/styleguide'

import withT from '../../lib/withT'
import { chfFormat } from '../../lib/utils/format'

const styles = {
  p: css(Interaction.fontRule, {
    margin: '0 0 5px',
    fontSize: 16,
    lineHeight: '22px',
    '& small': {
      display: 'block',
      fontSize: 14,
      lineHeight: '20px'
    }
  }),
  smallP: css(Interaction.fontRule, {
    margin: '0 0 5px',
    fontSize: 15,
    lineHeight: '22px',
    '& small': {
      display: 'block',
      fontSize: 10,
      lineHeight: '16px'
    }
  }),
  ul: css({
    margin: 0,
    marginTop: -3,
    paddingLeft: 20,
    fontSize: 15,
    lineHeight: '22px'
  })
}

export const Paragraph = ({ children, style }) => <p {...styles.p} style={style}>{children}</p>
export const SmallParagraph = ({ children, style }) => <p {...styles.smallP} style={style}>{children}</p>
export const UL = ({ children, style }) => <ul {...styles.ul} style={style}>{children}</ul>

export const Finance = withT(({ payload, t }) => (
  <>
    <Paragraph>
      <strong>
        {t('components/Card/personalBudget')}
      </strong>
      {payload.campaignBudget
        ? ` ${chfFormat(payload.campaignBudget)}`
        : !payload.campaignBudgetComment && <><br />{t('components/Card/na')}</>}
      {payload.campaignBudgetComment && <><br />{payload.campaignBudgetComment}<br /></>}
      <br />
      <strong>{t('components/Card/vestedInterests')}</strong>
      {!payload.vestedInterestsSmartvote.length && <><br />{t('components/Card/na')}</>}
    </Paragraph>
    {!!payload.vestedInterestsSmartvote.length && <UL>
      {payload.vestedInterestsSmartvote.map((vestedInterest, i) =>
        <li key={i}>
          {vestedInterest.name}
          {vestedInterest.entity ? ` (${vestedInterest.entity})` : ''}
          {vestedInterest.position ? `; ${vestedInterest.position}` : ''}
        </li>
      )}
    </UL>}
    <Paragraph>
      <small style={{ marginTop: 10 }}>{t('components/Card/sourceSmartvote')}</small>
    </Paragraph>
  </>
))
