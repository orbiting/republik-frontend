import Document, {
  Head,
  Main,
  NextScript
} from 'next/document'
import { renderStaticOptimized } from 'glamor/server'
import { fontFaces } from '@project-r/styleguide'

export default class MyDocument extends Document {
  static async getInitialProps ({ renderPage, pathname }) {
    const page = renderPage()
    const styles = renderStaticOptimized(() => page.html)
    return {
      ...page,
      ...styles,
      env: require('../lib/constants'),
      shouldTrackPiwik: pathname !== '/notifications'
    }
  }
  constructor (props) {
    super(props)
    const { __NEXT_DATA__, env } = props
    if (env) {
      __NEXT_DATA__.env = this.props.env
    }
  }
  render () {
    const { css, env: {
      PIWIK_URL_BASE, PIWIK_SITE_ID, PUBLIC_BASE_URL
    }, shouldTrackPiwik } = this.props
    const piwik = (
      shouldTrackPiwik &&
      !!PIWIK_URL_BASE &&
      !!PIWIK_SITE_ID
    )
    return (
      <html lang='de'>
        <Head>
          <meta
            name='viewport'
            content='width=device-width,initial-scale=1'
          />
          <meta
            httpEquiv='X-UA-Compatible'
            content='IE=edge'
          />
          <style
            dangerouslySetInnerHTML={{
              __html: fontFaces()
            }}
          />
          {css
            ? <style
              dangerouslySetInnerHTML={{ __html: css }}
            />
            : null}
          <meta name='author' content='Republik' />
          <link rel='apple-touch-icon' sizes='180x180' href={`${PUBLIC_BASE_URL}/static/apple-touch-icon.png`} />
          <link rel='icon' type='image/png' href={`${PUBLIC_BASE_URL}/static/favicon-32x32.png`} sizes='32x32' />
          <link rel='icon' type='image/png' href={`${PUBLIC_BASE_URL}/static/favicon-16x16.png`} sizes='16x16' />
          <link rel='manifest' href={`${PUBLIC_BASE_URL}/static/manifest.json`} />
          <link rel='mask-icon' href={`${PUBLIC_BASE_URL}/static/safari-pinned-tab.svg`} color='#000000' />
          <link rel='shortcut icon' href={`${PUBLIC_BASE_URL}/static/favicon.ico`} />
          { /* browserconfig.xml can contain other static references, we skip cdnifing it */ }
          <meta name='msapplication-config' content='/static/browserconfig.xml' />
          <meta name='referrer' content='no-referrer' />
        </Head>
        <body>
          <script dangerouslySetInnerHTML={{__html: `var _paq = _paq || [];`}} />
          <Main />
          <NextScript />
          {piwik && <script dangerouslySetInnerHTML={{__html: `
            _paq.push(['enableLinkTracking']);
            (function() {
              _paq.push(['setTrackerUrl', '${PIWIK_URL_BASE}/piwik.php']);
              _paq.push(['setSiteId', '${PIWIK_SITE_ID}']);
              var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
              g.type='text/javascript'; g.async=true; g.defer=true; g.src='${PIWIK_URL_BASE}/piwik.js'; s.parentNode.insertBefore(g,s);
            })();`}} />}
          {piwik && <noscript>
            <img src={`${PIWIK_URL_BASE}/piwik.php?idsite=${PIWIK_SITE_ID}&rec=1`} style={{border: 0}} alt='' />
          </noscript>}
        </body>
      </html>
    )
  }
}
