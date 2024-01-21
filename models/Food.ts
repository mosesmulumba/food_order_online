import mongoose, {Schema , Document} from "mongoose";

interface FoodDoc extends Document{
        vandorId: string;
        name: string;
        description:  string;
        category: string;
        foodType: string;
        readytime: number;
        price: number;
        rating: number;
        images: [string];

}


const FoodSchema = new Schema({
  
    vandorId: {type: String},
    name:{type: String , required: true},
    description:  {type: String , required: true},
    category:  {type: String , required: true},
    foodType: {type: String},
    readytime: {type: Number},
    price:{type: Number},
    rating:{type: Number},
    images: {type: [String]},

},
{
    toJSON:{
        transform(doc,ret){
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});

const Food = mongoose.model<FoodDoc>('food', FoodSchema);

export {Food};
