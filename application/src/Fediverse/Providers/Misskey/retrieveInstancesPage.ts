import { assertSuccessJsonResponse } from '../../assertSuccessJsonResponse'
import { z } from 'zod'
import { getDefaultTimeoutMilliseconds } from '../../getDefaultTimeoutMilliseconds'
import { NodeProviderMethod } from '../NodeProviderMethod'
import { NoMoreNodesError } from '../NoMoreNodesError'

const limit = 100

const schema = z.array(
  z.object({
    host: z.string()
  })
)

export const retrieveInstancesPage: NodeProviderMethod = async (
  domain,
  page,
  robotsTxt
) => {
  const response = await robotsTxt.postIfAllowed(
    `https://${domain}/api/federation/instances`,
    {
      host: null,
      blocked: null,
      notResponding: null,
      suspended: null,
      federating: null,
      subscribing: null,
      publishing: null,
      limit,
      offset: page * limit,
      sort: '+id'
    },
    {
      timeout: getDefaultTimeoutMilliseconds()
    }
  )
  assertSuccessJsonResponse(response)
  const responseData = schema.parse(response.data)
  if (responseData.length === 0) {
    throw new NoMoreNodesError('instance')
  }
  return responseData.map((item) => {
    return item.host
  })
}
