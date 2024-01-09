export interface CreateVandorInput{
    name: string;
    ownername: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
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