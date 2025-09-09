import  e, { Request, Response } from "express";
import prisma from "../Db/db";
import { z } from "zod";



// Zod schema for creating/updating an expense
export const expenseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().int(),
});

export const getexpenses=async (req:Request,res:Response)=>{
    try{

        const userId=(req as any).user.id ;
        console.log(userId);
        const expenses=await prisma.expense.findMany({
            where:{userId:userId}
        });
        res.json(expenses);
    }
    catch(error){
        res.status(500).json({message:"Internal server error"});
    }
}

export const addexpense = async (req: Request, res: Response) => {
  try {
    const parse = expenseSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ errors: parse.error.issues });
    }
    const decodeUser=(req as any).user;
    if(decodeUser!=null){
      return res.status(401).json({ message: "Not authenticated" });
    }
    

    const { title, amount, } = parse.data;

    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        userId:decodeUser.id,
      },
    });

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


export const updateexpense= async(req:Request,res:Response)=>{
    try {
        const parse=expenseSchema.safeParse(req.body);
        if(!parse.success){
            return res.status(400).json({errors:parse.error.issues});
        }
        const expenseId=Number(req.params.id);
        if(isNaN(expenseId)){
          return res.status(400).json({ message: "Invalid expense ID" });
        }

        const userId=(req as any).user.id;
        const expense=await prisma.expense.findUnique({where:{id:expenseId}})

        if(!expense || expense.userId !==userId){
            return res.status(404).json({message:"Expense not found or not owned by user"});
        }

        const updatedExpense=await prisma.expense.update({
            where:{id:expenseId},
            data:{
              title:parse.data.title,
              amount:parse.data.amount
            }
        })
        res.status(200).json(updatedExpense);

    } catch (error) {
        return res.status(500).json({message:"Internal server error",error:error});
    }
}

export const deleteexpense = async (req: Request, res: Response) => {
  try {
    const expenseId = parseInt(req.params.id, 10);
    if (isNaN(expenseId)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }

    const userId = (req as any).user.id;

    // Check if the expense exists and belongs to the user
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId},
    });

    if (!expense || expense.userId !== userId) {
      return res
        .status(404)
        .json({ message: "Expense not found or not owned by user" });
    }

    // Delete the expense
    await prisma.expense.delete({
      where: { id: expenseId},
    });

    return res.status(200).json({ message: `Expense with id ${expenseId} deleted successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
