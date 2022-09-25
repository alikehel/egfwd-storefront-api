import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../config/config";

export const isAutherized = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const jwtcookie = req.cookies.jwt;
        jwt.verify(jwtcookie as string, SECRET as jwt.Secret);
        next();
    } catch (err) {
        res.status(401);
        res.json("Access denied, invalid token");
        return;
    }
};
