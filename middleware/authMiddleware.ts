import jwt from 'jsonwebtoken';
import {Request,Response,NextFunction} from 'express';

//types
declare global {
    namespace Express {
        interface Request {
            user?: {userId:number};
        }
    }
}

export const authMiddleware=(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    //controller logic here
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message:"Unauthorized"});
    }

    const token=authHeader.split(' ')[1];

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET as string) as {userId:number};
        req.user=decoded;
        next();
    }catch(error){
        return res.status(403).json({message:"Invalid token"});
    }
};