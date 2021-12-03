import { NextApiRequest, NextApiResponse } from 'next'
import { initializeApollo } from '../../../lib/apollo/apolloClient'
import { gql } from '@apollo/client'
import {
  HTTPMethod,
  withAcceptedMethods
} from '../../../lib/helpers/APIHandler.helper'

interface PGPQueryResponse {
  user: {
    username: string
    name: string
    pgpPublicKey: string
  }
}

const PGPQuery = gql(`
  query pgpPublicKey($slug: String!) {
    user(slug: $slug) {
      username
      name
      pgpPublicKey
    }
  }
`)

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { userSlug } = req.query
  console.debug(userSlug)
  const apolloClient = initializeApollo()

  const response = await apolloClient.query<PGPQueryResponse>({
    query: PGPQuery,
    variables: {
      slug: userSlug as string
    }
  })
  console.debug(response)

  if (response.errors) {
    return res.status(503).end()
  }

  const { user } = response.data
  if (!user || !user.pgpPublicKey) {
    return res.status(404).end()
  }

  return res
    .status(200)
    .setHeader(
      'Content-Disposition',
      `attachment; filename=${user.username || user.name}.asc`
    )
    .send(user.pgpPublicKey)
}

export default withAcceptedMethods(handler, [HTTPMethod.GET])
