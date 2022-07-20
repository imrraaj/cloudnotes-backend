import express, { Request, Response, Router } from "express";
import { prisma } from "../index";
import { hash, compare } from "bcrypt";
import { z } from "zod";
import AuthMiddleware from "../middleware/authMiddleware";
import { signToken } from "../utils/signToken"
import { Req } from "../utils/types";


const router: Router = express.Router();


const loginData = z.object({
    username: z
        .string({
            required_error: "Username is required!",
            invalid_type_error: "Username must be a string",
        })
        .trim()
        .min(3, { message: "Must be 3 or more characters long" }),
    password: z
        .string()
        .trim()
        .min(8, { message: "Must be 8 or more characters long" }),
});

const signupData = z.object({
    name: z.string(),
    username: z
        .string({
            required_error: "Username is required!",
            invalid_type_error: "Username must be a string",
        })
        .trim()
        .min(3, { message: "Must be 3 or more characters long" }),
    password: z
        .string()
        .trim()
        .min(8, { message: "Must be 8 or more characters long" }),
    email: z.string().email({
        message: "Email is required!",
    }),
});

router.post("/login", async (req: Request, res: Response) => {
    const data = loginData.safeParse(req.body);
    if (data.success === false) {
        return res
            .status(401)
            .json({ status: false, data: { message: "Invalid Data!" } });
    }

    const ExistingUser = await prisma.user.findFirst({
        where: {
            username: { equals: data.data.username },
        },
    });

    if (ExistingUser === null)
        return res
            .status(404)
            .json({ status: false, data: { message: "User Not Found!" } });

    const compredPwd = await compare(data.data.password, ExistingUser.password);

    if (compredPwd === false) {
        return res
            .status(400)
            .json({ error: "Please Login with correct credentials" });
    }

    const payload = {
        user: {
            id: ExistingUser.id,
            username: ExistingUser.username,
            email: ExistingUser.email,
        },
    };

    const token = await signToken(payload)
    return res.json({ status: true, data: { token, user: payload.user } });
});



router.post("/signup", async (req: Request, res: Response) => {
    const data = signupData.safeParse(req.body);

    if (data.success === false) {
        console.log(data);
        return res.status(401).json({ status: false, data: { message: "Invalid Data!" } });
    }

    const existingUsers = await prisma.user.findMany({
        where: {
            OR: [
                { email: { equals: data.data.email } },
                { username: { equals: data.data.username } },
            ],
        },
    });

    if (existingUsers.length > 0)
        return res.json({ status: false, data: { message: "Please Login with correct credentials!!!" } });

    const user = await prisma.user.create({
        data: {
            email: data.data.email,
            password: await hash(data.data.password, 10),
            name: data.data.name,
            username: data.data.username,
        },
    });

    const payload = {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
    };

    const token = await signToken(payload)
    return res.json({ status: true, data: { token, user: payload.user } });
});





router.post("/forgot-password", AuthMiddleware, async (req: Req, res: any) => {
    const umail = req.user.email;
    if(!req.body.password){
        res.json({ status: false, data: { message: "Invalid Password!!" } });
        return;
    }

    try {
        await prisma.user.update({
            where: {
                email: umail,
            },
            data: {
                password: await hash(req.body.password, 10),
            },
        });
        res.json({ status: true, data: { message: "Password changed!!" } });
    } catch (e) {
        res.json({ status: false, data: { message: e } });
    }
});





router.delete("/account", AuthMiddleware, async (req: Req, res: any) => {
    try {
        const deleteUser = await prisma.user.delete({
            where: {
                email: req.user.email,
            },
        });

        console.log(deleteUser);
        res.json({ status: true, data: { message: "User Deleted!!" } });
    } catch (e) {
        res.json({ status: false, data: { message: e } });
    }
});

export default router;
