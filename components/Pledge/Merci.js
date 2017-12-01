import {format} from 'url'

export const gotoMerci = (query) => {
  // workaround for apollo cache issues
  // - can't manage to clear all query caches
  // - couldn't clear myAddress query,
  //   possibly because id-less address type
  window.location = format({
    pathname: '/account',
    query
  })
  // Router.push({
  //   pathname: '/merci',
  //   query
  // }).then(() => {
  //   window.scrollTo(0, 0)
  // })
}
