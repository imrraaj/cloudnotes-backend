import { Request } from "express";

export interface User {
    email: string,
    username: string,
    id: string
}


export interface Payload {
    user: User
};
export interface Req extends Request {
    user: User
}