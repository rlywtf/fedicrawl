import { createMissingNodes } from '../../Storage/Nodes/createMissingNodes'
import { ElasticClient } from '../../Storage/ElasticClient'

export const addNodeSeed = async (elastic: ElasticClient, domains:string[]):Promise<boolean> => {
  console.info('Trying to add seed domain nodes', { domains: domains })
  const result = await createMissingNodes(elastic, domains, undefined)
  return result > 0
}
