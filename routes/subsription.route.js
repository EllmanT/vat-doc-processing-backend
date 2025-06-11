import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { createSubsription, getUserSubscriptions } from "../controller/subscription.controller.js";

const subsriptionRouter = Router();

subsriptionRouter.get('/',(req,res)=>{
    res.send({title:'GET  all subsriptions'})
})
subsriptionRouter.get('/:id',(req,res)=>{
    res.send({title:'GET all subsription details'})
})
subsriptionRouter.post('/',authorize,createSubsription);

subsriptionRouter.put('/:id',(req,res)=>{
    res.send({title:'UPDATE subsription'})
})
subsriptionRouter.delete('/:id',(req,res)=>{
    res.send({title:'DELETE all subsription'})
})
subsriptionRouter.delete('/:id',authorize,getUserSubscriptions)
subsriptionRouter.put('/:id/cancel',(req,res)=>{
    res.send({title:'CANCEL subsription'})
})
subsriptionRouter.get('/upcoming-renewals',(req,res)=>{
    res.send({title:'GET upcoming renewals'})
})

export default subsriptionRouter