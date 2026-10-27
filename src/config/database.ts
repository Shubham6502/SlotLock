import { Pool } from "pg";
import "dotenv/config";

const URL=process.env.DATABASE_URL


if(!URL){
    throw new Error ("Database url is Missing")
}

export const pool=new Pool({
    connectionString: URL,
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
})

pool.on("error",(error)=>{
    console.log("unexpected postgres pool error",error)
})

export async function connectDB() :Promise<void>{
  const result = await pool.query("SELECT NOW() AS time");
  console.log("PostgreSQL connected:", result.rows[0].time);

}