import express from "express";

import { PORT } from "./config/env.js";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import docProcessingRouter from "./routes/docProcessing.route.js";

const app = express();

// Built in node js middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
// app.use(arcjetMiddleware)


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/docprocessing", docProcessingRouter)

app.use(errorMiddleware);
app.get("/",(req, res)=>{
    res.send("Welcome here to the application")
})


app.listen(PORT,async()=>{
    console.log(`Api running on localhost:${PORT}`);


})

export default app;