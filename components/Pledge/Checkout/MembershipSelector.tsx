import React, { useMemo } from 'react'
import { css } from 'glamor'
import {
  mediaQueries,
  plainButtonRule,
  useColorContext,
  useMediaQuery,
  Field,
  Interaction
} from '@project-r/styleguide'

type RewardType = {
  name: string
  __typename: string
}

type OptionType = {
  id?: string
  label: string
  reward: RewardType
  price: number
  userPrice?: boolean
  minUserPrice?: number
  suggestedPrice?: number
}

type MembershipSelectorTypes = {
  membershipOptions: OptionType[]
  onMembershipSelect: (option: OptionType) => void
  onOwnPriceSelect: (price: number) => void
  selectedMembershipOption: OptionType
}

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    [mediaQueries.mUp]: {
      flexDirection: 'row'
    }
  }),
  button: css({
    flex: 1,
    padding: 12,
    textAlign: 'left',
    ':not(:first-of-type)': {
      marginTop: 4,
      [mediaQueries.mUp]: {
        marginLeft: 4
      }
    }
  }),
  label: css({
    [mediaQueries.mUp]: {
      display: 'block'
    }
  }),
  infocontainer: css({
    display: 'flex',
    width: '100%'
  })
}

const MembershipSelector = ({
  membershipOptions,
  onMembershipSelect,
  onOwnPriceSelect,
  selectedMembershipOption
}: MembershipSelectorTypes) => {
  const [colorScheme] = useColorContext()
  const isDesktop = useMediaQuery(mediaQueries.mUp)
  const buttonStyle = useMemo(
    () =>
      css({
        backgroundColor: colorScheme.getCSSColor('hover'),
        '@media (hover)': {
          ':hover': {
            backgroundColor: colorScheme.getCSSColor('divider')
          }
        }
      }),
    []
  )
  const selectedButtonStyle = useMemo(
    () =>
      css({
        backgroundColor: colorScheme.getCSSColor('text'),
        color: colorScheme.getCSSColor('default')
      }),
    []
  )
  return (
    <>
      <div {...styles.container}>
        {membershipOptions.map((option: OptionType, index) => (
          <>
            <button
              key={option.id}
              {...plainButtonRule}
              {...styles.button}
              {...(option.label === selectedMembershipOption.label
                ? selectedButtonStyle
                : buttonStyle)}
              onClick={() => onMembershipSelect(option)}
              style={{ order: index }}
            >
              <span {...styles.label}>{option.label}</span>
              <span>CHF {option.price / 100}</span>
            </button>
            <div
              {...styles.infocontainer}
              style={{
                order: isDesktop ? 3 : index,
                display:
                  option.label === selectedMembershipOption.label
                    ? 'inherit'
                    : 'none'
              }}
            >
              {option.userPrice && <Field onChange={onOwnPriceSelect} />}
              <Interaction.P>{option.label}</Interaction.P>
            </div>
          </>
        ))}
      </div>
    </>
  )
}

export default MembershipSelector
