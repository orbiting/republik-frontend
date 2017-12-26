import React from 'react'
import { css } from 'glamor'

import { Link } from '../../lib/routes'
import Share from '../Share'
import VideoPlayer from '../VideoPlayer'

import { PUBLIC_BASE_URL } from '../../lib/constants'

import {
  Interaction,
  fontFamilies,
  P as SerifP,
  colors,
  linkRule
} from '@project-r/styleguide'

const { H3, P } = Interaction

const styles = {
  detail: css({
    width: '100%',
    padding: '30px 45px',
    float: 'left'
  }),
  detailTitle: css({
    lineHeight: '20px'
  }),
  detailRole: css({
    fontSize: 17,
    fontFamily: fontFamilies.sansSerifRegular,
    color: colors.secondary
  }),
  number: css({
    marginBottom: 20,
    fontFamily: fontFamilies.sansSerifMedium
  })
}

const Detail = ({
  t,
  share,
  data: { id, username, hasPublicProfile, name, credentials, statement, portrait, sequenceNumber, video }
}) => (
  <div {...styles.detail}>
    <div
      style={
        video ? (
        {
          maxWidth: 400,
          marginLeft: 'auto',
          marginRight: 'auto'
        }
        ) : (
          {}
        )
      }
    >
      <H3 {...styles.detailTitle}>
        {hasPublicProfile ? (
          <Link route='profile' params={{ slug: username || id }}>
            <a {...linkRule} style={{color: 'inherit'}}>
              {name}
            </a>
          </Link>
        ) : (
          <span>{name}</span>
        )}{' '}
        <span {...styles.detailRole}>
          {credentials[0] && credentials[0].description}
        </span>
      </H3>
      {video ? (
        <div
          style={{
            marginBottom: 20,
            marginTop: 10
          }}
        >
          <VideoPlayer key={id} src={{ ...video, poster: portrait }} autoPlay />
        </div>
      ) : (
        <SerifP>«{statement}»</SerifP>
      )}
      {!!sequenceNumber && (
        <P {...styles.number}>
          {t('memberships/sequenceNumber/label', {
            sequenceNumber
          })}
        </P>
      )}
      {share && (
        <Share
          // ToDo: download={smImage}
          url={`${PUBLIC_BASE_URL}/community?id=${id}`}
          emailSubject={t('testimonial/detail/share/emailSubject', {
            name
          })}
        />
      )}
    </div>
  </div>
)

Detail.defaultProps = {
  share: true
}

export default Detail
