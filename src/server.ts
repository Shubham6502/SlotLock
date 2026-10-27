
import {pool,connectDB} from "./config/database";
import {redis,connectRedis} from "./config/redis"
import app from "./app"
const PORT:number=3000;


async function startServer(){
try{
    await connectDB();
    await connectRedis();

    const server=app.listen(PORT,()=>{
         console.log(`app is Running on port ${PORT}`)
    })

    const shutdown=(signal:string)=>{

    console.log(`${signal} received. Shutting down...`);

      server.close(() => {

        void Promise.allSettled([
          pool.end(),
          redis.quit(),
        ]).then(() => process.exit(0));
      });
    };
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}catch(error){
 console.error("Failed to start SlotLock:", error);
    await Promise.allSettled([pool.end(), redis.quit()]);
    process.exitCode = 1;
}
}

 void startServer();