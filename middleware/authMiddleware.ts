import jwt, { JwtPayload } from "jsonwebtoken";
import type { Req, User } from "../utils/types"
const SECRET_KEY: string = process.env.SECRET_KEY!;

interface jwtCustom extends JwtPayload {
    user: User
}


export default async function Authorize(req: Req, res: any, next: any) {


    const token = req.headers.authorization;
    if (!token) return res.status(404).send({ status: false, data: { message: "Token does not exist!!" } });


    try {
        const data = await jwt.verify(token, SECRET_KEY);
        const DATA = data as jwtCustom;
        req.user = DATA.user;
    } catch (error) {
        res.clearCookie();
        return res
            .status(401)
            .json({ status: false, data: { message: "Please authenticate using valid token" } });
    }
    next();
    return;
}

