import { NextApiRequest, NextApiResponse } from 'next'
import chalk from 'chalk'
import useragent from 'useragent'

export default (req: NextApiRequest, res: NextApiResponse): void => {
  if (req.method === 'POST') {
    console.warn(
      chalk.yellow(
        'reportError from',
        // TODO: replace useragent dependency
        useragent(req.headers['user-agent']),
        req.body
      )
    )
    return res.status(200).send({
      ack: true
    })
  }

  return res.status(405).json({
    message: 'Method not Allowed'
  })
}
