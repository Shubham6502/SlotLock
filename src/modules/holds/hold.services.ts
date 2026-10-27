import { pool } from "../../config/database";

export async function getHold(seatId:string){
  
    const data= await pool.query(`
        SELECT seat_id,user_id,status,expire_at
        FROM holds 
        WHERE seat_id=$1
        AND status='active'
        AND expire_at> NOW() 
        ORDER BY created_at DESC LIMIT 1`,[seatId]
    )
    
    return data.rows[0]??null
}