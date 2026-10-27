import Router from "express"
import { getHoldStatus } from "./hold.controller";

const router=Router();

router.get("/:id",getHoldStatus);

export default router