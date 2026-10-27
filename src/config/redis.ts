import { createClient } from "redis";
import "dotenv/config";

const redisUrl=process.env.REDIS_URL;

if(!redisUrl){
    throw new Error("redis Url Not found")
}
export const redis=createClient({
    url:redisUrl
})

redis.on("error",(error)=>{
    console.log("unexpected error in redis", error);
})

export async function connectRedis(){
    if(!redis.isOpen){
        await redis.connect();
    }

    const response= await redis.ping();
    console.log("Redis Response",response)
}