import ArticlePage from '../[...path]'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'

/**
 * Reexport the article page with SSR-mode.
 */
export default withDefaultSSR(ArticlePage)
