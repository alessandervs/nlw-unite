import z from "zod"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { generateSlug } from "../utils/generateSlug"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"


export async function createEvent(app: FastifyInstance){
  app
  .withTypeProvider<ZodTypeProvider>()
  .post('/events', {
    schema:{
      body: z.object({
        title:  z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
      }),
      response:{
        201: z.object({
          eventId: z.string().uuid()
        }),
        401: z.object({
          message: z.string()
        })
      },
    }
  }, async (req , reply) =>{
    
    const {
      title,
      details,
      maximumAttendees
    } = req.body
  
    const slug = generateSlug(title)
  
    const eventWithSameSlug = await prisma.event.findUnique({
      where: {
        slug,
      }
    })
  
    if(eventWithSameSlug !== null){
      reply.status(401).send({message: 'Another event with same title already exists.'})
    }
    const event = await prisma.event.create({
      data: {
        title,
        details,
        maximumAttendees,
        slug,
      }
    }) 
    return reply.status(201).send({eventId: event.id})
  })
}

