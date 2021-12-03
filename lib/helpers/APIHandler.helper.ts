import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS'
}

/**
 * Only pass the request to a handler if it has one of the accepted HTTP-methods.
 * @param handler
 * @param methods
 */
export function withAcceptedMethods(
  handler: NextApiHandler,
  methods: HTTPMethod[]
): NextApiHandler {
  return (req: NextApiRequest, res: NextApiResponse) => {
    if (
      req.method === 'OPTIONS' ||
      (methods as string[]).includes(req.method)
    ) {
      handler(req, res)
    } else {
      res.status(405).end()
    }
  }
}
