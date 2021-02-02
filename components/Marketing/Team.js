import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import {
  Loader,
  TeaserFrontTileRow,
  TeaserFrontTile,
  Label,
  fontStyles,
  Editorial,
  useColorContext
} from '@project-r/styleguide'

import { Link } from '../../lib/routes'
import SectionTitle from './Common/SectionTitle'
import SectionContainer from './Common/SectionContainer'

const Team = ({ t, data: { loading, employees } }) => {
  const [colorScheme] = useColorContext()
  return (
    <SectionContainer>
      <SectionTitle
        title={t('marketing/page/team/title')}
        lead={t('marketing/page/team/lead')}
      />
      <Loader
        loading={loading}
        style={{ minHeight: 400 }}
        render={() => (
          <TeaserFrontTileRow autoColumns>
            {employees.map(employee => {
              return (
                <TeaserFrontTile key={employee.name} padding={'0 5%'}>
                  <h3 {...styles.pitch}>{`«${employee.pitch}»`}</h3>
                  <div {...styles.employee}>
                    <Link href={`~${employee.user.slug}`} passHref>
                      <a>
                        <img
                          {...styles.profilePicture}
                          src={employee.user.portrait}
                          alt=''
                        />
                      </a>
                    </Link>
                    <div {...styles.employeeText}>
                      <p {...styles.employeeName}>{employee.name}</p>
                      <Label {...colorScheme.set('color', 'disabled')}>
                        {employee.title}
                      </Label>
                    </div>
                  </div>
                </TeaserFrontTile>
              )
            })}
          </TeaserFrontTileRow>
        )}
      />
      <Editorial.P style={{ textAlign: 'center' }}>
        <Link route='team' passHref>
          <Editorial.A style={{ ...fontStyles.sansSerifRegular18 }}>
            Alle Teammitglieder
          </Editorial.A>
        </Link>
      </Editorial.P>
    </SectionContainer>
  )
}

const styles = {
  profilePicture: css({
    display: 'block',
    width: 46,
    flex: `0 0 ${46}`,
    height: 46,
    marginRight: 8
  }),
  pitch: css({
    ...fontStyles.serifTitle26,
    wordWrap: 'break-word'
  }),
  employee: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  employeeText: css({
    textAlign: 'left'
  }),
  employeeName: css({
    ...fontStyles.sansSerifRegular18,
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
    margin: 0
  })
}

const query = gql`
  query MarketingPage {
    employees(withBoosted: true, shuffle: 3, withPitch: true) {
      title
      name
      group
      subgroup
      pitch
      user {
        id
        portrait
        slug
      }
    }
  }
`

export default compose(graphql(query))(Team)
