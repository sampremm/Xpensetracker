import  express  from "express";  
import { signup } from "../controller/signup";
import { login } from "../controller/login";
import { logout } from "../controller/logout";
import{authMiddleware} from "../middleware/auth"
import {getexpenses}from "../controller/expense"
import {addexpense,updateexpense,deleteexpense} from "../controller/expense"


const router= express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);





router.get("/expense/",authMiddleware,getexpenses);
router.post("/expense/add",authMiddleware,addexpense);
router.put("/expense/:id",authMiddleware,updateexpense);
router.delete("/expense/delete/:id",authMiddleware,deleteexpense);

export default router;