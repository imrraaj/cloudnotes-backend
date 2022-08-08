import express, { Router } from "express";
import AuthMiddleware from "../middleware/authMiddleware";
import { Req } from "../utils/types";
import { prisma } from "../index";
import { z } from "zod";

const router: Router = express.Router();

const PostData = z.object({
    title: z.string().trim(),
    description: z.string().trim(),
    tag: z.string().trim(),
});

const SharePostData = z.object({
    postId: z.string().trim(),
    username: z.string().trim(),
});

router.get("/all", AuthMiddleware, async (req: Req, res: any) => {
    try {
        const data = await prisma.post.findMany({
            where: {
                userId: req.user.id,
            },
        });

        res.json({ status: true, data });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ status: true, data: { message: "Internal server error" } });
    }
});

router.get("/get/:id", AuthMiddleware, async (req: Req, res: any) => {
    try {
        const data = await prisma.post.findMany({
            where: {
                id: req.params.id,
            },
        });
        res.json({ status: true, data });
    } catch (error) {
        res
            .status(500)
            .json({ status: true, data: { message: "Internal server error" } });
    }
});

router.post("/add", AuthMiddleware, async (req: Req, res: any) => {
    try {
        const data = PostData.safeParse(req.body);
        if (data.success === false) {
            return res
                .status(401)
                .json({ status: false, data: { message: "Invalid Data!" } });
        }

        const post = await prisma.post.create({
            data: {
                title: data.data.title,
                description: data.data.description,
                tag: data.data.tag,
                userId: req.user.id,
            },
        });
        return res.json({ status: true, data: post });
    } catch (error) {
        return res
            .status(500)
            .json({ status: false, data: { message: "Internal Server Error!!" } });
    }
});

router.put("/update/:id", AuthMiddleware, async (req: Req, res: any) => {
    try {
        const data = PostData.safeParse(req.body);
        if (data.success === false) {
            return res
                .status(401)
                .json({ status: false, data: { message: "Invalid Data!" } });
        }

        if (!req.params.id) {
            return res
                .status(401)
                .json({ status: false, data: { message: "Invalid Data!" } });
        }

        let note = await prisma.post.findUnique({
            where: {
                id: req.params.id,
            },
        });

        if (!note) {
            return res
                .status(401)
                .json({ status: false, data: { message: "Invalid Data!" } });
        }

        if (note.userId !== req.user.id) {
            return res
                .status(401)
                .json({ status: false, data: { message: "Not Allowed!" } });
        }

        note = await prisma.post.update({
            where: {
                id: req.params.id,
            },
            data: {
                title: data.data.title,
                description: data.data.description,
                tag: data.data.tag,
            },
        });
        res.status(401).json({ status: true, data: note });
    } catch (error) {
        res
            .status(500)
            .json({ status: false, data: { message: "Internal Server Error!!" } });
    }
});

//get single note

router.delete("/delete/:id", AuthMiddleware, async (req: Req, res: any) => {
    try {
        let note = await prisma.post.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!note) {
            return res
                .status(404)
                .json({ status: false, data: { message: "Post Not Found" } });
        }

        if (note.userId !== req.user.id) {
            return res
                .status(401)
                .json({ status: false, data: { message: "Not Allowed!" } });
        }

        note = await prisma.post.delete({
            where: {
                id: req.params.id,
            },
        });

        res
            .status(302)
            .json({ status: true, data: { message: "Post deleted sucessfully!!" } });
    } catch (error) {
        res
            .status(500)
            .json({ status: false, data: { message: "Internal Server Error!!" } });
    }
});

router.post("/share", AuthMiddleware, async (req: Req, res: any) => {

    try {
        const data = SharePostData.safeParse(req.body);
        if (data.success === false) {
            return res
                .status(401)
                .json({ status: false, data: { message: "Invalid Data!" } });
        }



        // validating that user owns this post
        let note = await prisma.post.findUnique({
            where: {
                id: data.data.postId,
            },
        });
        if (!note) {
            return res
                .status(404)
                .json({ status: false, data: { message: "Post Not Found" } });
        }

        if (note.userId !== req.user.id) {
            return res
                .status(401)
                .json({ status: false, data: { message: "Not Allowed!" } });
        }


        const user = await prisma.user.findUnique({
            where: {
                username: data.data.username,
            },
        });

        if (user === null) {
            return res
                .status(401)
                .json({ status: false, data: { message: "No user Found!" } });
        }

        // if user wants to share with him/her self
        if(user.id === req.user.id){
            return res
                .status(401)
                .json({ status: false, data: { message: "Can not share with yourself!!!" } });
        }

        await prisma.sharedPost.create({
            data: {
                postId: data.data.postId,
                accessId: user.id,
            },
        });
        res
            .status(302)
            .json({ status: true, data: { message: "Post shared sucessfully!!" } });
    } catch (e) {
        res
            .status(500)
            .json({ status: false, data: { message: "Internal Server Error!!" } });
    }
});




router.get("/shared-with-me", AuthMiddleware, async (req: Req, res: any) => {

    try {
        const response = await prisma.sharedPost.findMany({
            where: {
                accessId: req.user.id
            }
        });
        const ids = response.map(e => e.postId);
        if (ids.length > 0) {

            const data = await prisma.post.findMany({
                where: {
                    id: { in: ids }
                }
            });

            return res
                .status(302)
                .json({ status: true, data: { message: data } });
        }
        res
            .status(302)
            .json({ status: true, data: { message: response } });
    } catch (e) {
        res
            .status(500)
            .json({ status: false, data: { message: "Internal Server Error!!" } });
    }
});





router.post("/unshare", AuthMiddleware, async (req: Req, res: any) => {

    try {
        const data = SharePostData.safeParse(req.body);
        if (data.success === false) {
            return res
                .status(401)
                .json({ status: false, data: { message: "Invalid Data!" } });
        }

        const user = await prisma.user.findUnique({
            where: {
                username: data.data.username,
            },
        });

        if (user === null) {
            return res
                .status(401)
                .json({ status: false, data: { message: "No user Found!" } });
        }

        let resp = await prisma.sharedPost.findUnique({
            where: {
                accessId_postId: {
                    accessId: user.id,
                    postId: data.data.postId,
                }
            }
        });

        if(resp === null){
            return res
                .status(401)
                .json({ status: false, data: { message: "Post not shared with the user" } });
        }
        
        resp = await prisma.sharedPost.delete({
            where: {
                accessId_postId: {
                    accessId: user.id,
                    postId: data.data.postId,
                }
            }
        });

        res
            .status(302)
            .json({ status: true, data: { message: "Post unshared sucessfully!!" } });
    } catch (e) {
        res
            .status(500)
            .json({ status: false, data: { message: "Internal Server Error!!" } });
    }
});
export default router;
