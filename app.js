import express from "express";

import { PORT } from "./config/env.js";

import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import docProcessingRouter from "./routes/docProcessing.route.js";

const app = express();

app.use(cors({
    origin: 'http://localhost:4200'|"http:localhost:3000"|"https://app.fiscalcloud.co.zw ", // or use a list of domains
    credentials: true,
}));
// Built in node js middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
// app.use(arcjetMiddleware)


app.use("/api/v1/docprocessing", docProcessingRouter)

app.use(errorMiddleware);
app.get("/",(req, res)=>{
    res.send("Welcome here to the application")
})


app.listen(PORT,async()=>{
    console.log(`Api running on localhost:${PORT}`);


})

export default app;