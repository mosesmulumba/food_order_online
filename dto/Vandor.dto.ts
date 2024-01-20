export interface CreateVandorInput{
    name: string;
    ownername: string;
    foodTypes: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface VanderEditInputs{
    name:string;
    ownername: string;
    pincode: string;
    address: string;
    phone: string;
    password: string;
    foodTypes: [string];
}

export interface VandorLoginInputs{
    email: string;
    password: string;

}

export interface VandorPayLoad{
    _id: string;
    email: string;
    name: string;
    foodTypes: [string];
}