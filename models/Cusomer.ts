import mongoose , {Schema , Document } from 'mongoose';

interface CustomerDoc extends Document{
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    otp: number,
    otp_expiry: Date,
    lng: number,
    lat: number,
    address: string,
    verified: boolean
    salt: string;
};

const CustomerSchema = new Schema({
    email: {type: String , required: true},
    password: {type: String , required: true},
    firstName: {type: String},
    lastName: {type: String},
    phone: {type: String},
    otp: {type: Number ,required: true},
    otp_expiry: {type: Date ,required: true} ,
    lng:{type: Number},
    lat: {type: Number},
    address: {type: String},
    verified: {type: Boolean},
    salt: {type: String}
},{
   toJSON:{
       transform(doc, ret){
           delete ret.password;
           delete ret.salt;
           delete ret.__v;
           delete ret.createdAt;
           delete ret.updatedAt;
       }
   },
   timestamps:true
});

const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema);

export {Customer}