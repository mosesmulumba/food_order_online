 import mongoose , {Schema , Document , Model} from 'mongoose';

 interface VandorDoc extends Document{
    name: string;
    ownername: string;
    foodTypes: [string];
    password: string;
    pincode: string;
    address: string;
    email: string;
    rating: number;
    salt: string;
    phone: string;
    serviceAvailable: string;
    coverImages: [string];
    foods:any
 };

 const VandorSchema = new Schema({
    name: {type:String , required: true},
    ownername: {type:String , required: true},
    foodTypes: {type: [String ]},
    password: {type :String , required :true},
    pincode: {type: String , required: true},
    address: {type: String ,  required :true},
    email: {type:String , required :true},
    rating: {type:Number},
    salt: {type:String , required: true} ,
    phone: {type:String },
    serviceAvailable: {type:Boolean},
    coverImages: {type :  [String]},
    foods: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'food'
    }]
 },{
    toJSON:{
        transform(doc, ret){
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
            // delete ret.coverImages;
        }
    },
    timestamps:true
 });

 const Vandor = mongoose.model<VandorDoc>('vandor', VandorSchema);

 export {Vandor}