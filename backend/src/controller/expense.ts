import { Request, Response } from "express";
import prisma from "../Db/db";


export const getexpenses=async (req:Request,res:Response)=>{
    try{

        const userId=(req as any).user.id ;
        // console.log(userId);
        const expenses=await prisma.expense.findMany({
            where:{userId:userId}
        });
        res.json(expenses);
        // console.log(expenses);
    }
    catch(error){
        res.status(500).json({message:"Internal server error"});
    }
}
