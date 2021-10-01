import { getRandomInt } from '../lib/utils/helpers'
import { MAX_PAYNOTE_SEED } from '../components/Article/PayNote'
import Article from '../components/Article/Page'
import withDefaultSSR from '../lib/hocs/withDefaultSSR'

Article.getInitialProps = () => {
  return {
    payNoteTryOrBuy: Math.random(),
    payNoteSeed: getRandomInt(MAX_PAYNOTE_SEED)
  }
}

export default withDefaultSSR(Article)
