import { sign } from "jsonwebtoken";
import { Payload } from "./types"

const SECRET_KEY: string = process.env.SECRET_KEY!;


export async function signToken(payload: Payload) {
    const token = await sign(payload, SECRET_KEY, { algorithm: "HS256", expiresIn: "2h" });
    return token;
}
