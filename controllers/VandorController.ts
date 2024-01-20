import { Request , Response , NextFunction } from "express";
import { FindVandor } from "./AdminController";
import { VanderEditInputs, VandorLoginInputs } from "../dto";
import { GenerateSignature, ValidatePassword } from "../utility";

export const VandorLogin = async(req:Request , res:Response , next:NextFunction)=>{
    const {email , password} = <VandorLoginInputs>req.body;

    const existingVandor = await FindVandor('', email);
    if(existingVandor !== null){
        // validate and give acces
        const validation = await ValidatePassword(password, existingVandor.password , existingVandor.salt);
        if(validation){

            const signature = GenerateSignature({
                _id: existingVandor.id,
                email: existingVandor.email,
                name: existingVandor.name,
                foodTypes: existingVandor.foodTypes,
            })
            return res.json(signature);
        }else{
            return res.json({"message": "Password is not valid!"});
        }
    }
    return res.json({"message": "Login is  not valid"});
} 


export const GetVandorProfile =  async(req: Request, res: Response, next: NextFunction)=>{

    const user = req.user;
    if(user){
        const existingVandor = await FindVandor(user._id);
        return res.json(existingVandor);
    }
    return res.json({"message": "Vandor information is not found!"})
}

export const UpdateVandorProfile =  async(req: Request, res: Response, next: NextFunction)=>{

    const {name, ownername, pincode, address, phone, password, foodTypes} =<VanderEditInputs>req.body;

    const user = req.user;
    if(user){
        const existingVandor = await FindVandor(user._id);
        if(existingVandor !== null){
            existingVandor.name = name;
            existingVandor.ownername = ownername;
            existingVandor.pincode = pincode;
            existingVandor.address = address;
            existingVandor.phone = phone;
            existingVandor.password = password;
            existingVandor.foodTypes = foodTypes;

            const savedChanges = await existingVandor.save();
            res.json(savedChanges);
        }
        return res.json(existingVandor);
    }
    return res.json({"message": "Vandor information is not found!"})
}

export const UpdateVandorService =  async(req: Request, res: Response, next: NextFunction)=>{

    
}