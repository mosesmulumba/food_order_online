import express , {Request , Response , NextFunction} from 'express';
import { GetFoodsAvailability, GetFoodsIn30Min, GetRestaurantById, GetTopRestaurants, SearchFoods } from '../controllers/ShoppingController';

const router = express.Router();

router.get('/:pincode' , GetFoodsAvailability);

router.get('/top-restaurants/:pincode', GetTopRestaurants);

router.get('/foods-in-30-min/:pincode' , GetFoodsIn30Min);

router.get('/search/:pincode' , SearchFoods);

router.get('/restaurants/:id ' , GetRestaurantById);

export {router as ShoppingRoute}

