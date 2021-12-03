import { NextApiRequest, NextApiResponse } from 'next'
import chalk from 'chalk'
import useragent from 'useragent'
import {
  HTTPMethod,
  withAcceptedMethods
} from '../../lib/helpers/APIHandler.helper'

function handler(req: NextApiRequest, res: NextApiResponse): void {
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

export default withAcceptedMethods(handler, [HTTPMethod.POST])
