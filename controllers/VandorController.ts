import { Request , Response , NextFunction } from "express";
import { FindVandor } from "./AdminController";
import { CreateFoodInput, VanderEditInputs, VandorLoginInputs } from "../dto";
import { GenerateSignature, ValidatePassword } from "../utility";
import { Food } from "../models";

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

export const AddFood =  async(req: Request, res: Response, next: NextFunction)=>{

    const user = req.user;

    const { name, description ,category ,foodType ,readytime , price} = <CreateFoodInput>req.body;

    const vandor = await FindVandor(user?._id);

    if(vandor !== null){
        const files = req.files as [Express.Multer.File];

        const images = files.map((file: Express.Multer.File) => file.filename);

        const createdFood = await Food.create({
            vandorId: vandor._id,
            name: name,
            description:  description,
            category: category,
            foodType: foodType,
            readytime: readytime,
            price:0,
            images: images
        })

        vandor.foods.push(createdFood);
        const result = await vandor.save();

        return res.json(result);
    }
    return res.json({message: "Something went wrong!"})
}

export const GetFoods =  async(req: Request, res: Response, next: NextFunction)=>{

 const user = req.user;
 
 if(user){
    const foods = await Food.find({vandorId: user._id});
    if(foods !== null){
        console.log(foods);
        return res.json(foods);
    }
 }
 return res.json({message: "The foods information was not found!"});
}

export const UpdateCoverImages =  async(req: Request, res: Response, next: NextFunction)=>{

    const user = req.user;

    const vandor = await FindVandor(user?._id);

    if(vandor !== null){
        const files = req.files as [Express.Multer.File];

        const images = files.map((file: Express.Multer.File) => file.filename);


        vandor.coverImages.push(...images);
        const result = await vandor.save();

        return res.json(result);
    }
    return res.json({message: "Something went wrong!"})
}