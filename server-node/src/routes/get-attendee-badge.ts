import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function getAttendeeBadge(app: FastifyInstance){
app
.withTypeProvider<ZodTypeProvider>()
.get('/attendees/:attendeeId/badge',{
  schema:{
    params: z.object({
      attendeeId: z.coerce.number().int()
    })
  }
}, async (request, reply)=>{
  const {attendeeId} = request.params
  const attendee = await prisma.attendee.findUnique({
    select: {
      name: true,
      email: true,
      event:{
        select: {
          title: true
        }
      }
    },
    where: {
      id: attendeeId,
    }
  })

  if(attendee === null){
    return reply.status(401).send({message: "Attendee not found!"})
  }

  return reply.status(201).send({attendee})

})
}