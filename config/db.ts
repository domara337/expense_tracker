import pg from "pg";
import env from "dotenv";










env.config();




const pool=new pg.Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port:Number(process.env.DB_PORT)
});


pool.on('connect',()=>{
    console.log("Connected to the database");
});


pool.on('error',(err)=>{
    console.error("Database error:",err);
    process.exit(-1);
});

export default pool;