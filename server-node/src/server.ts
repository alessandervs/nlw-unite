import fastify from "fastify"
import {serializerCompiler, validatorCompiler} from "fastify-type-provider-zod"
import { createEvent } from "./routes/create-event"
import { registerForEvent } from "./routes/register-for-event"
import { getEvent } from "./routes/get-event"
import { getAttendeeBadge } from "./routes/get-attendee-badge"

const SERVER_PORT = Number(process.env.SERVER_PORT)
const app = fastify()
// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)

app.listen({port: SERVER_PORT}).then(()=>{
  console.log("Http Server Running!")
})