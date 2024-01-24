import express, { Application } from 'express';

import { AdminRoute, VandorRoute, ShoppingRoute , CustomerRoute } from '../routes';
import bodyParser from 'body-parser';
import path from 'path';

export default async(app: Application)=>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended : true}));
    app.use('/images' , express.static(path.join(__dirname, 'images')));
    
    app.use('/admin' , AdminRoute);
    app.use('/vandor' , VandorRoute);
    app.use('/customer' , CustomerRoute);
    app.use(ShoppingRoute)
    
}
