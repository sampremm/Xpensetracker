import  express  from "express";  
import { signup } from "../controller/signup";
import { login } from "../controller/login";
import{authenticate} from "../middleware/auth"
import {getexpenses}from "../controller/expense"



const router= express.Router();

router.post("/signup", signup);
router.post("/login", login);





router.get("/expense",authenticate,getexpenses);

export default router;