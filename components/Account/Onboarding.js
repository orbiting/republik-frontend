import React from 'react'
import { css } from 'glamor'

import { Interaction, A, useColorContext } from '@project-r/styleguide'
import withT from '../../lib/withT'
import Link from 'next/link'

const { P, Emphasis } = Interaction

const styles = {
  container: css({
    padding: '8px 16px',
    marginBottom: 24
  })
}
export default withT(({ t }) => {
  const [colorScheme] = useColorContext()
  return (
    <div {...styles.container} {...colorScheme.set('backgroundColor', 'hover')}>
      <P>
        <Emphasis>🔧 {`${t('Account/Onboarding/title')}: `}</Emphasis>
        {t.elements('Account/Onboarding/text', {
          link: (
            <Link key='link' href='/einrichten' passHref>
              <A>
                <Emphasis>{t('Account/Onboarding/link')}</Emphasis>
              </A>
            </Link>
          )
        })}
      </P>
    </div>
  )
})
