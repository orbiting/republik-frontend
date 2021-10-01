import { getRandomInt } from '../lib/utils/helpers'
import { MAX_PAYNOTE_SEED } from '../components/Article/PayNote'
import Article from '../components/Article/Page'
import createGetStaticProps from '../lib/helpers/createGetStaticProps'
import { GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { BasePageProps } from './_app'
import { getDocument } from '../components/Article/graphql/getDocument'
import { gql } from '@apollo/client'

type Params = {
  path: string[]
} & ParsedUrlQuery

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps = createGetStaticProps<BasePageProps, Params>(
  async (client, params) => {
    console.log('FETCHING GET STATIC PROPS!!!')
    const path = '/' + params.path.join('/')

    const {
      data: { article }
    } = await client.query({
      query: getDocument,
      variables: {
        path
      }
    })

    if (article) {
      return {
        props: {
          payNoteTryOrBuy: Math.random(),
          payNoteSeed: getRandomInt(MAX_PAYNOTE_SEED)
        },
        revalidate: 10
      }
    }

    const {
      data: { redirection }
    } = await client.query({
      query: gql`
        query getRedirect($path: String!) {
          redirection(path: $path) {
            target
            status
          }
        }
      `,
      variables: {
        path
      }
    })

    if (redirection) {
      return {
        redirect: {
          destination: redirection.target,
          statusCode: redirection.status
        }
      }
    }

    return {
      notFound: true
    }
  }
)

export default Article
