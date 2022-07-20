if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import { PrismaClient } from '.prisma/client';
import express from 'express';
import Auth from "./routes/auth";
import securePaths from "./routes/secureRoutes";


export const prisma = new PrismaClient();


const app = express();
const PORT: (string | number) = process.env.PORT || 5000;

app.use(express.json());
app.use('/auth', Auth);
app.use('/api', securePaths);

app.use(express.urlencoded({ extended: false }));


app.listen(PORT, () => console.log(`Server is started on http://localhost:${PORT}`));
