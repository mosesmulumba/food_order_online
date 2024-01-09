import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { VandorPayLoad } from '../dto';
import { APP_SECRET } from '../config';

export const GenerateSalt = async() =>{
    return await bcrypt.genSalt();
}

export const GeneratePassword = async(password: string , salt: string)=>{
    return await bcrypt.hash(password , salt);
}

export const ValidatePassword = async(enteredPassword: string, savedPassword: string, salt: string )=>{
    return await GeneratePassword(enteredPassword , salt) === savedPassword;
}

export const GenerateSignature = (payload: VandorPayLoad)=>{
    return jwt.sign(payload , APP_SECRET,{expiresIn: "1d"}) ;
  
}