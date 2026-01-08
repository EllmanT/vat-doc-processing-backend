import express from "express";

import { PORT } from "./config/env.js";

import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import docProcessingRouter from "./routes/docProcessing.route.js";

const app = express();

const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:3000',
  'https://app.fiscalcloud.co.zw',
  'https://www.app.fiscalcloud.co.zw',
  'https://staging.fiscalcloud.co.zw',
  'https://www.staging.fiscalcloud.co.zw',
  'https://fiscalcloud.co.zw',
  'https://www.fiscalcloud.co.zw'
];

// Handle preflight OPTIONS requests explicitly for Vercel
app.options('*', cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS preflight blocked: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
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