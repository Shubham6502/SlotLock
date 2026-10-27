import express from "express"
import events from "./modules/events/events.routes"
import hold from "./modules/holds/hold.routes"
const app=express();

app.use(express.json())
app.use("/event",events)
app.use("/hold",hold)


export default app;