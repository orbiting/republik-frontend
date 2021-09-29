export const membership = {
  status: {
    label: 'Republik Mitglied seit 12. Juli 2017, ABO #23234',
    description:
      'Ihr nächster Mitgliederbeitrag ist in 233 Tagen (12. August 2021) fällig.',
    since: '2021-04-01',
    until: '2021-05-01',
    autoPay: true,
    canAutoPay: true,
    canCancel: true
  },
  options: [
    {
      label: 'Automatische Zahlung nicht aktiv',
      description:
        'Beim Aktivieren wird der Mitgliederbeitrag am 12.08.21 automatisch abgebucht.',
      type: 'primary',
      action: {
        label: 'Jetzt aktivieren',
        type: 'toggle-autopay',
        creditCard: 'Visa **4242'
      }
    },
    {
      label: 'Mitgliederbeitrag jetzt bezahlen',
      description: 'CHF 240.',
      type: 'negative',
      action: {
        label: 'Jetzt bezahlen',
        type: 'direct-pay',
        creditCard: 'Visa **4242'
      }
    },
    {
      label: 'Mitgliedschaft künden',
      type: 'mini',
      action: {
        label: 'Mitgliedschaft künden',
        type: 'link',
        href: '/cancel'
      }
    }
  ]
}
