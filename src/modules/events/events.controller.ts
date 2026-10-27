import type { Request, Response, NextFunction } from "express";
import { getAllEvents,getEventById ,addEvent,getAllSeats,addSeats} from "./events.services";
import type{ AppController } from "../../types/express";



export async function getEvents( _req:Request, res:Response, next:NextFunction){
    try{
       const events=await getAllEvents();
       res.status(200).json({success:true, count:events.length, data:events})
    }catch(err){
        next(err);
    }
}
export async function getEvent(_req:Request, res:Response, next:NextFunction){
    try{
       const id=_req.params.id
    //    console.log(id);
       const event=await getEventById(id);

        if (!event) {
             return res.status(404).json({
             success: false,
              message: "Event not found",
           });
        }

       return res.status(200).json({success:true ,data:event})

    }catch(err){
        next(err)
    }  
}
export const createEvent:AppController=async(_req,res,next)=>{
    try{
        const {name,start_at}=_req.body;
        const result= await addEvent({name,start_at})

        return res.status(201).json({
            success:true,
            message:"event Created",
            data:result
        })

    }catch(err){
        next(err)
    }
}
// seat controllers
export const getSeats:AppController=async(_req,res,next)=>{
    try{
         const {id}=_req.params;

         if (!/^[1-9]\d*$/.test(id)) {
              res.status(400).json({
              success: false,
              message: "Invalid event ID",
              });
           return;
        }

         const data= await getAllSeats(id);
         if(!data){
            res.status(200).json({success:true,messege:"Data Not Found"})
         }
         res.status(200).json({success:true, data:data})
    
    }catch(err){
        next(err);
    }
   
}
export const createSeats:AppController=async(_req,res,next)=>{
    
    try{
    const {id}=_req.params;
    const {seatNumbers}=_req.body;

     if(!Array.isArray(seatNumbers)|| seatNumbers.length==0 
        // !seatNumbers.every((seat)=>{
        //     typeof seat=== "string" &&  /^[A-Za-z0-9-]{1,10}$/.test(seat)
        // }) 
        || new Set(seatNumbers).size!=seatNumbers.length
        ){
             res.status(400).json({
        success: false,
        message: "Provide unique, valid seat numbers",
      });
      return;
   
     }

    const result=await addSeats({eventId:id,seatNumbers:seatNumbers})
    if(!result){
        res.status(404).json({success:false,messege:"Event Not Fount"})
    }
    res.status(201).json({success:true,data:result})
   }catch(err){
        next(err)
   }
}