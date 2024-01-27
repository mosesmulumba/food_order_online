import { IsEmail, IsEmpty, Length } from "class-validator";


export class CreateCustomerInput{
    @IsEmail()
    email: string;

    @Length(7 , 12)
    phone: string;

    @Length(6 , 12)
    password: string;

}

export class UserLoginIputs{
    @IsEmail()
    email: string;

    @Length(6 , 12)
    password: string;

}

export class EditCustomerProfileInputs{
    @Length(6 , 12)
    firstName: string;

    @Length(6 , 12)
    lastName: string;

    @Length(6 , 12)
    address: string;

}

export interface CusomerPayload{
    _id: string;
    email: string;
    verified: boolean;
}