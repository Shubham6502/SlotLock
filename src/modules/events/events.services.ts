
import {pool} from "../../config/database"

export async function getAllEvents(){
    const data= await pool.query(`
        SELECT id,name,start_at,created_at
        FROM events
        ORDER BY start_at ASC
        `);

    return data.rows;
}

export async function getEventById(id:string){
   
  const data= await pool.query(`
    SELECT id,name,start_at,created_at
    FROM events
    WHERE id=$1
    `,[id])

    return data.rows[0] ?? null;
}

interface EventInputs{
    name:string,
    start_at:string
}
export async function addEvent(data:EventInputs){
    const {name,start_at}=data;
  
  
    const res= await pool.query(`
        INSERT INTO events (name,start_at)
         values ($1,$2)
        RETURNING id,name,start_at,created_at`,
        [name,start_at])
        return res.rows;
}

export async function getAllSeats(id:string){

    const event=await pool.query(
        `SELECT id from events WHERE id=$1`,[id]
    )
    if(event.rows.length==0){
        return null;
    }
    const data=await pool.query(
        `SELECT id,event_id,seat_no,status,hold_expire_at
        FROM seats
        WHERE event_id=$1
        ORDER BY seat_no ASC`,[id]
    )
    return data.rows;
}
interface CreateSeatInputs{
    eventId:string,
    seatNumbers:string[]
}

export async function addSeats({eventId,seatNumbers}:CreateSeatInputs){
    const client=await pool.connect()
    try{

        await client.query("BEGIN")
        const event=await client.query(`SELECT id FROM events WHERE id=$1`,[eventId])

        if(event.rows.length==0){
            await client.query("ROLLBACK")
            return null;
        }
       

        const result=await client.query(`INSERT INTO seats (event_id,seat_no)
            SELECT $1, seat_no FROM unnest($2::text[]) AS seat_no
            RETURNING id,event_id,seat_no,status`,[eventId,seatNumbers]);

            await client.query("COMMIT");

            return result.rows;
    }catch(err){
        await client.query("ROLLBACK");
        throw err
    }finally{
        client.release();
    }
}