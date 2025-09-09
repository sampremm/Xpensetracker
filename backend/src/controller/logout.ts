import { Express, Request, Response } from "express";


export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
};

