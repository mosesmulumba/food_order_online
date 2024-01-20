import { Request , Response , NextFunction } from 'express';
import { CreateVandorInput } from '../dto';
import { Vandor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';

export const FindVandor = async(id: string | undefined , email?:string)=>{
 if(email){
    return await Vandor.findOne({email: email});
 }else{
    return await Vandor.findById(id);
 }
}

export const CreateVandor = async(req:Request , res:Response , next:NextFunction)=>{
        const { name , ownername , foodTypes, password, pincode, address, email , phone} = <CreateVandorInput>req.body;

        const existingVandor = await FindVandor('', email);
        if(existingVandor !== null){
            res.json({message: "A vandor with the same email ID already exists!"});
        };
    

        // generate the salt
        const salt = await GenerateSalt();
        const UserPassword = await GeneratePassword(password , salt);
        // generate the password using the salt

        const createdVandor = await Vandor.create({
            name: name,
            ownername: ownername,
            foodTypes: foodTypes,
            password: UserPassword, 
            pincode: pincode, 
            address: address, 
            email:email, 
            phone:phone,
            salt: salt,
            serviceAvailable: false,
            coverImages: []
        })
        console.log(createdVandor);
    
        return res.json(createdVandor);

};

export const GetVandors = async(req:Request , res:Response , next:NextFunction)=>{

    const vandors = await Vandor.find();
    if(vandors !== null){
        return res.json(vandors);
    }
    return res.json({"message": "there are no vandors yet!"});
};

export const GetVandorByID = async(req:Request , res:Response , next:NextFunction)=>{
    const vandorId = req.params.id;

    const vandor = await FindVandor(vandorId);
    if(vandorId !== null){
        return res.json(vandor);

    }
    return res.json({"message": "No data found for vandor ID"});
};
