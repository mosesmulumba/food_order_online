import {Request, Response , NextFunction } from "express"
import { ValidateSignature } from "../utility";
import { AuthPayload } from "../dto/Auth.dto";

declare global{
    namespace Express{
        interface Request{
            user?: AuthPayload;
        }
    }
}

export const Authenicate = async(req: Request, res: Response, next: NextFunction)=>{
    const validate = await ValidateSignature(req);
    if(validate){
        next()
    }else{
        return res.json({"message": "User not Authorized"})
    }
}