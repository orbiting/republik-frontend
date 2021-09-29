export type MembershipType = {
  status: StatusType
  options: OptionType[]
}

export type StatusType = {
  label: string
  description: string
  since: Date
  until: Date
  autoPay: boolean
  canAutoPay: boolean
  canCancel: boolean
}

export type OptionType = {
  label: string
  description: string
  type: 'primary' | 'secondary' | 'negative' | 'mini'
  action: ActionType
}

export type ActionType = {
  label: string
  type: 'toggle-autopay' | 'direct-pay' | 'link'
  creditCard?: string
  href?: string
}
