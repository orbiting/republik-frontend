import React, { Fragment } from 'react'

import withT from '../../lib/withT'
import { Checkbox, Label, Editorial } from '@project-r/styleguide'

import createPersistedState from '../../lib/hooks/use-persisted-state'

import { Paragraph } from './Shared'
import Spider, { axes as spiderAxes } from './Spider'

export const useCardPreferences = createPersistedState('republik-card-preferences')

const nullSmartspider = [-1, -1, -1, -1, -1, -1, -1, -1]

const Filters = ({ t }) => {
  const [preferences, setPreferences] = useCardPreferences({})

  return <>
    <Paragraph>
      <strong>{t('components/Card/Preferences/filter')}</strong>
    </Paragraph>
    <Checkbox
      checked={preferences.portrait}
      onChange={(_, checked) => {
        setPreferences(p => ({ ...p, portrait: checked }))
      }}
    >
      {t('components/Card/Preferences/filter/portrait')}
    </Checkbox>
    <br style={{ clear: 'left' }} />
    <Checkbox
      checked={preferences.smartspider}
      onChange={(_, checked) => {
        setPreferences(p => ({ ...p, smartspider: checked }))
      }}
    >
      {t('components/Card/Preferences/filter/smartspider')}
    </Checkbox>
    <br style={{ clear: 'left' }} />
    <Checkbox
      checked={preferences.statement}
      onChange={(_, checked) => {
        setPreferences(p => ({ ...p, statement: checked }))
      }}
    >
      {t('components/Card/Preferences/filter/statement')}
    </Checkbox>
    <br style={{ clear: 'left' }} />
    <br />
    <Paragraph>
      <strong>{t('components/Card/Preferences/mySmartspider')}</strong>
    </Paragraph>
    <Paragraph>
      {t.elements('components/Card/Preferences/mySmartspider/intro', {
        link: <Editorial.A key='link' href={t('components/Card/Preferences/mySmartspider/intro/linkHref')}>
          {t('components/Card/Preferences/mySmartspider/intro/linkText')}
        </Editorial.A>
      })}
    </Paragraph>
    <br />

    {(preferences.mySmartspider || nullSmartspider).map((value, i) => {
      return <Fragment key={i}>
        <Label>{spiderAxes[i].text.replace(/\n/g, ' ')}</Label><br />
        <input type='range'
          value={value}
          min='-10'
          max='100'
          onChange={(e) => {
            const newValue = +e.target.value
            setPreferences(p => ({ ...p,
              mySmartspider: [
                ...(p.mySmartspider || nullSmartspider).slice(0, i),
                newValue,
                ...(p.mySmartspider || nullSmartspider).slice(i + 1)
              ] }))
          }} />
        <br />
      </Fragment>
    })}
    {preferences.mySmartspider && <>
      <br />
      <Checkbox
        checked={preferences.mySmartspiderSort}
        onChange={(_, checked) => {
          setPreferences(p => ({ ...p, mySmartspiderSort: checked }))
        }}
      >
        {t('components/Card/Preferences/mySmartspider/sort')}
      </Checkbox>
      <br style={{ clear: 'left' }} />
      <Spider
        size={280}
        fill={'#000'}
        data={preferences.mySmartspider} />
      <br /><br />
      <Editorial.A href='#' onClick={(e) => {
        e.preventDefault()
        if (window.confirm(t('components/Card/Preferences/mySmartspider/resetConfirm'))) {
          setPreferences(({ mySmartspider, ...rest }) => rest)
        }
      }}>
        {t('components/Card/Preferences/mySmartspider/reset')}
      </Editorial.A>
    </>}
  </>
}

export default withT(Filters)
