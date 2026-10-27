import { success } from "zod";
import { AppController } from "../../types/express";
import { getHold } from "./hold.services";

export const getHoldStatus:AppController=async(_req,res,next)=>{
    const {id}=_req.params;
    const data=await getHold(id);
    res.status(200).json({success:true,data})
}