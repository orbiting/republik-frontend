import React from 'react'
import { css } from 'glamor'
import Link from 'next/link'
import {
  fontStyles,
  Button,
  plainButtonRule,
  useColorContext,
  mediaQueries
} from '@project-r/styleguide'
import { OptionType, ActionType } from './Membership.types'

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    [mediaQueries.mUp]: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }),
  column: css({
    ':not(:last-child)': {
      marginBottom: 16,
      [mediaQueries.mUp]: {
        marginBottom: 0
      }
    }
  }),
  buttonContainer: css({
    [mediaQueries.mUp]: {
      width: 192
    }
  }),
  label: css({
    ...fontStyles.sansSerifMedium18
  }),
  description: css({
    ...fontStyles.sansSerifRegular15
  }),
  secondaryButton: css({ ...plainButtonRule, borderWidth: 0 }),
  link: css({
    ...fontStyles.sansSerifRegular16,
    textDecoration: 'underline'
  })
}

const MembershipOption = ({ label, description, type, action }: OptionType) => {
  const [colorScheme] = useColorContext()
  if (type === 'mini') {
    return <MiniAction {...action} />
  }
  return (
    <div {...styles.container}>
      <div {...styles.column}>
        <div {...styles.label}>{label}</div>
        <div {...styles.description}>{description}</div>
      </div>
      <div {...styles.buttonContainer}>
        <Button
          block
          {...plainButtonRule}
          primary={type === 'primary' || type === 'secondary'}
          reduced={type === 'secondary' || type === 'negative'}
        >
          {action.label}
        </Button>
      </div>
    </div>
  )
}

const MiniAction = ({ href, label }: ActionType) => {
  const [colorScheme] = useColorContext()

  return (
    <Link href={href} passHref>
      <a {...styles.link} {...colorScheme.set('color', 'default')}>
        {label}
      </a>
    </Link>
  )
}

export default MembershipOption
