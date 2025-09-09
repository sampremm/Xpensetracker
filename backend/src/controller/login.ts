import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../Db/db";
import bcrypt from "bcrypt";
import { z } from "zod";

const loginSchema = z.object({
    email:z.string().email("Invalid email address"),
    password:z.string().min(6,"Password must be at least 6 characters"),
})

export const login = async (req: Request, res: Response) => {
    try {
        const validate = loginSchema.safeParse(req.body);
        if (!validate.success) {
            return res.status(400).json({ errors: validate.error.issues });
        }
        const user = await prisma.user.findUnique({
            where: { email: validate.data.email }
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });    
        }
        const isPasswordValid = await bcrypt.compare(validate.data.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: "JWT secret key not configured" });
        }
        const token = jwt.sign(
          { id: user.id, email: user.email },
          jwtSecret,
          { expiresIn: "24h" }
        );
        res.cookie("token", token, {
        httpOnly: true,       // cannot be accessed via JS
        secure: process.env.NODE_ENV === "production", // HTTPS only in prod
        sameSite: "strict",   // CSRF protection
        maxAge: 24 * 60 * 60 * 1000, // 24h
  })
  .json({ message: "User created", token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

