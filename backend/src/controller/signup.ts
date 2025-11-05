import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../Db/db";
import bcrypt from "bcrypt";
import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signup = async (req: Request, res: Response) => {
  try {
    const validate = signupSchema.safeParse(req.body);

    if (!validate.success) {
      return res.status(400).json({ errors: validate.error.issues });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: validate.data.email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(validate.data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: validate.data.name,
        email: validate.data.email,
        password: hashedPassword,
      }
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: "JWT secret key not configured" });
    }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
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

  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
    console.log(err);
  }
};
