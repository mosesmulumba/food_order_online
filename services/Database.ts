import mongoose  from 'mongoose';

import { MONGO_URI } from '../config';

export default async()=>{
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        autoIndex: true, // Don't build indexes
        // poolSize: 10, // Maintain up to 10 socket connections
        // serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        // family: 4 // Use IPv4, skip trying IPv6
      };
    
      mongoose.connect(MONGO_URI, options).then(result => {
            console.log("mongoDB is running");
        }).catch(err => console.log('error' + err));
      
    
    // mongoose.connect(MONGO_URI, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //     useCreateIndex: true,
    // }).then(result => {
    //     console.log(result)
    // }).catch(err => console.log('error' + err))
    
}
