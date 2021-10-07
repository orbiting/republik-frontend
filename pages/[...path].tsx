import { getRandomInt } from '../lib/utils/helpers'
import { MAX_PAYNOTE_SEED } from '../components/Article/PayNote'
import Article from '../components/Article/Page'
import createGetStaticProps from '../lib/helpers/createGetStaticProps'
import { GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { gql } from '@apollo/client'
import { getPublicDocumentData } from '../components/Article/graphql/getDocument'

type Params = {
  path: string[]
} & ParsedUrlQuery

type Props = {
  payNoteTryOrBuy: number
  payNoteSeed: number
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps = createGetStaticProps<Props, Params>(
  async (client, params) => {
    const path = '/' + params.path.join('/')

    const {
      data: { article }
    } = await client.query({
      query: getPublicDocumentData,
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
