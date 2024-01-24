import express, {Request, Response, NextFunction} from "express";
import { FoodDoc, Vandor } from "../models";

export const GetFoodsAvailability = async(req:Request , res: Response, next: NextFunction)=>{

    const pincode = req.params.pincode;

    const results = await Vandor.find({pincode: pincode, serviceAvailable: false})
    .sort([['rating', 'descending']])
    .populate("foods")

    if(results.length > 0){
        return res.status(200).json(results)
    }
    return res.status(400).json({message:"no data found"});

}


export const GetTopRestaurants = async(req:Request , res: Response, next: NextFunction)=>{
 
    
    const pincode = req.params.pincode;

    const results = await Vandor.find({pincode: pincode, serviceAvailable: false})
    .sort([['rating', 'descending']])
    .limit(2)

    if(results.length > 0){
        return res.status(200).json(results)
    }
    return res.status(400).json({message:"no data found"});
}


export const GetFoodsIn30Min= async(req:Request , res: Response, next: NextFunction)=>{
    

    const pincode = req.params.pincode;

    const results = await Vandor.find({pincode: pincode, serviceAvailable: false})
    .populate("foods")

    if(results.length > 0){
        let foodResult: any=[];
        results.map(vandor =>{
            const foods = vandor.foods as [FoodDoc]
            foodResult.push(...foods.filter(food => food.readytime <= 30));
        })
        return res.status(200).json(foodResult)
    }
    return res.status(400).json({message:"no data found"});
}


export const SearchFoods = async(req:Request , res: Response, next: NextFunction)=>{
    const pincode = req.params.pincode;

    const results = await Vandor.find({pincode: pincode, serviceAvailable: false})
    .populate("foods")

    if(results.length > 0){
        let foodResult : any=[];
        results.map(item => foodResult.push(...item.foods))
        return res.status(200).json(foodResult);
    }
    return res.status(400).json({message:"no data found"});
}


export const GetRestaurantById = async(req:Request , res: Response, next: NextFunction)=>{
    const id = req.params.id;

    const result = await Vandor.findById(id).populate("foods")
    if(result){
        return res.status(200).json(result)
    }
    return res.status(400).json({message:"No data found"})
}
