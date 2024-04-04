import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";


export async function getEvent(app: FastifyInstance){
  app
  .withTypeProvider<ZodTypeProvider>()
  .get('/events/:eventId',{
    schema: {
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
       
      },
    },
  }, async (request, reply)=>{
    const {eventId} = request.params

    const event = await prisma.event.findUnique({
      select:{
        id: true,
        title: true,
        details: true,
        slug: true,
        maximumAttendees: true,
        _count:{
          select:{
            attendee: true
          }
        }
      },
      where: {
        id: eventId
      }
    })
    if(event == null){
      reply.status(401).send({message: 'Event not found!.'})

    }
    return reply.status(201).send({
      event: {
        id: event?.id,
        title: event?.title,
        details: event?.details,
        slug: event?.slug,
        maximumAttendees: event?.maximumAttendees,
        amountAttendee: event?._count.attendee
      }
    })
  })

}