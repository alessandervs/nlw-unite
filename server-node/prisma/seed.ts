import {prisma} from "../src/lib/prisma"

async function seed(){
  await prisma.event.create({
    data: {
      id: "89fe283b-6877-4b1b-a5fb-d8a95a65d126",
      title: "Evento teste",
      details: "Detalhes do evento teste",
      slug: "evento-teste",
      maximumAttendees: 200,
    }
  })
}

seed().then(() =>{
  console.log("Database seed created!")
  prisma.$disconnect()
})