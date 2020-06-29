export const getUtmParams = query => {
  // support /probelesen?campaign=x
  let defaultCampaign = query.campaign
  // check matomo attribution cookie
  if (typeof window !== 'undefined' && window.Matomo) {
    defaultCampaign =
      window.Matomo.getTracker().getAttributionCampaignName() || defaultCampaign
  }

  const params = defaultCampaign ? { utm_campaign: defaultCampaign } : {}

  Object.keys(query)
    .filter(key => key.startsWith('utm_'))
    .forEach(key => {
      params[key] = query[key]
    })

  return params
}
