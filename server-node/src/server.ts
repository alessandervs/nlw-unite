import fastify from "fastify"
import fastifyCors from "@fastify/cors"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUI from "@fastify/swagger-ui"

import {serializerCompiler, validatorCompiler, jsonSchemaTransform} from "fastify-type-provider-zod"
import { createEvent } from "./routes/create-event"
import { registerForEvent } from "./routes/register-for-event"
import { getEvent } from "./routes/get-event"
import { getAttendeeBadge } from "./routes/get-attendee-badge"
import { checkIn } from "./routes/check-in"
import { getEventAttendees } from "./routes/get-event-attendess"
import { errorHandler } from "./error-handler"
import { health } from "./routes/health"

const SERVER_PORT = Number(process.env.SERVER_PORT)
const app = fastify()
// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors,{
  origin: '*'
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: "pass.in",
      description: "Especificação da API para o back-end da aplicação pass.in contruida para o NLW Unite.",
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUI,{
  routePrefix: '/docs',
})

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(checkIn)
app.register(getEventAttendees)
app.register(health)

app.setErrorHandler(errorHandler)

app.listen({port: SERVER_PORT, host: '0.0.0.0'}).then(()=>{
  console.log("Http Server Running!")
})