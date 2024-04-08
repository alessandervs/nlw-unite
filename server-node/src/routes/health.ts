import {FastifyInstance} from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const health = async(app: FastifyInstance)=>{

  app
  .withTypeProvider<ZodTypeProvider>()
  .get('/helth', async (req,reply)=>{
    return reply.status(200).send()
  })
}