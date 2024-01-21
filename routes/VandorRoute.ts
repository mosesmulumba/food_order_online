import express , {Request , Response , NextFunction} from 'express';
import { AddFood, GetFoods, GetVandorProfile, UpdateCoverImages, UpdateVandorProfile, VandorLogin } from '../controllers';
import { Authenicate } from '../middlewares';
import multer from 'multer';

const router = express.Router();

// configure the multer
const imageStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null , 'images')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString+ '_'+file.originalname)
    }
});

const images = multer({storage: imageStorage}).array('images', 10);


router.post('/login' , VandorLogin);

router.use(Authenicate);
router.get('/profile', GetVandorProfile);
router.patch('/profile', UpdateVandorProfile);
router.patch('/cover-image', images , UpdateCoverImages);

router.post('/food' ,images,  AddFood);
router.get('/foods' , GetFoods);
// console.log(GetFoods);

export { router as VandorRoute};