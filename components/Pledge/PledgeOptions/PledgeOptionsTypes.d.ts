export type RewardType = {
  name: string
  __typename: string
  minPeriods: number
  maxPeriods: number
  defaultPeriods: number
}

export type SuggestionType = {
  price: number
  label: string
  description: string
  userPrice: boolean
  favorite?: boolean
}

export type OptionType = {
  id?: string
  optionGroup: string
  reward: RewardType
  minAmount?: number
  maxAmount?: number
  defaultAmount?: number
  price?: number
  suggestions: SuggestionType[]
  membership?: {
    user: {
      isUserOfCurrentSession: boolean
    }
  }
}

export type PackageType = {
  name: string
  suggestedTotal?: number
  options: OptionType[]
}
