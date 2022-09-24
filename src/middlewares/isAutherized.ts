import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const isAutherized = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // const cookies = req.headers.cookie;
        // const cookie = cookies?.split(";");
        const jwtcookie = req.cookies.jwt;
        // console.log(
        //     "🚀 ~ file: isAutherized.ts ~ line 15 ~ cookies",
        //     jwtcookie
        // );
        // const authHeader = req.headers.authorization;
        // const token = authHeader?.split(" ")[1];
        // console.log("🚀 ~ file: isAutherized.ts ~ line 12 ~ token", token);
        jwt.verify(jwtcookie as string, process.env.SECRET as jwt.Secret);
        next();
    } catch (err) {
        res.status(401);
        // throw new Error(`not autherized. ${err}`);
        res.json("Access denied, invalid token");
        return;
    }
};
