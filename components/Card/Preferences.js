import React, { Fragment } from 'react'
import { css } from 'glamor'

import withT from '../../lib/withT'
import { Checkbox, Label, Editorial, mediaQueries } from '@project-r/styleguide'

import createPersistedState from '../../lib/hooks/use-persisted-state'

import { Paragraph } from './Shared'
import Spider, { axes as spiderAxes } from './Spider'
import Slider from './Slider'

export const useCardPreferences = createPersistedState('republik-card-preferences')

const styles = {
  mySmartspider: css({
    position: 'relative'
  }),
  mySmartspiderSpider: css({
    [mediaQueries.mUp]: {
      position: 'absolute',
      right: 0,
      top: 0
    }
  })
}

const inactiveValue = -1
const nullSmartspider = [inactiveValue, inactiveValue, inactiveValue, inactiveValue, inactiveValue, inactiveValue, inactiveValue, inactiveValue]

const Filters = ({ t }) => {
  const [preferences, setPreferences] = useCardPreferences({})

  const setSlider = (newValue, i) => setPreferences(p => {
    let newSmartspider = [
      ...(p.mySmartspider || nullSmartspider).slice(0, i),
      newValue,
      ...(p.mySmartspider || nullSmartspider).slice(i + 1)
    ]
    if (newSmartspider.every(v => v === inactiveValue)) {
      newSmartspider = undefined
    }
    return {
      ...p,
      mySmartspiderSort: p.mySmartspiderSort === undefined
        ? newValue >= 0 ? true : undefined
        : p.mySmartspiderSort,
      mySmartspider: newSmartspider
    }
  })

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

    <div {...styles.mySmartspider}>
      {(preferences.mySmartspider || nullSmartspider).map((value, i) => {
        const onUp = (e) => {
          if (e.target.value < 0) {
            setSlider(inactiveValue, i)
          }
        }
        return <Fragment key={i}>
          <Label>
            {spiderAxes[i].text.replace(/\n/g, ' ').trim()}:
            {' '}
            {value < 0 ? 'keine Angaben' : value}
          </Label><br />
          <Slider
            value={value}
            min={inactiveValue}
            max='100'
            inactive={value < 0 || value === null}
            onChange={(e, newValue) => {
              setSlider(newValue, i)
            }}
            onMouseUp={onUp}
            onTouchEnd={onUp} />
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
        <div {...styles.mySmartspiderSpider}>
          <Spider
            size={280}
            fill='#000'
            fillOpacity={0.3}
            data={preferences.mySmartspider.map(v => Math.max(0, v))}
            reference={preferences.mySmartspider} />
        </div>
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
    </div>
  </>
}

export default withT(Filters)
