import z from "zod"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { generateSlug } from "../utils/generateSlug"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { BadRequest } from "./_error/bad-request"


export async function createEvent(app: FastifyInstance){
  app
  .withTypeProvider<ZodTypeProvider>()
  .post('/events', {
    schema:{
      summary: "Create an event",
      tags: ['Event'],
      body: z.object({
        title:  z.string({invalid_type_error: "O título precisa ser um texto"}).min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
      }),
      response:{
        201: z.object({
          eventId: z.string().uuid()
        }),
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
      throw new BadRequest('Another event with same title already exists.')
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

