if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import { PrismaClient } from '.prisma/client';
import express from 'express';
import Auth from "./routes/auth";
import securePaths from "./routes/secureRoutes";
const cors = require('cors');
// const cookieParser = require('cookie-parser')
import cookieParser from "cookie-parser";
export const prisma = new PrismaClient();


const app = express();
const PORT: (string | number) = process.env.PORT || 5000;

// let corsOptions = {
//   origin: 'http://127.0.0.1:5500', //frontend url
//   credentials: true
// }

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/auth', Auth);
app.use('/api', securePaths);

app.use(express.urlencoded({ extended: false }));

app.get('/',(req,res)=>{
  console.log(req);
  res.json({
    status:"OK"
  })
})
app.listen(PORT, () => console.log(`Server is started on http://localhost:${PORT}`));
