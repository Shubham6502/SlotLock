import {Router} from "express"
import { getEvents,getEvent ,createEvent,getSeats,createSeats} from "./events.controller";
const router=Router();

router.get("/",(getEvents))
router.get("/:id",getEvent)
router.post("/",createEvent)
router.get("/:id/seats",getSeats)
router.post("/:id/seats",createSeats)
export default router