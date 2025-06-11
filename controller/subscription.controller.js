import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subsription.model.js"


export const createSubsription = async (req, res,next)=>{
    try {
        console.log(req.user._id);
        const subscription = await Subscription.create({
            ...req.body,
            user:req.user._id
        });

            console.log(subscription)
        const {workflowRunId}= await workflowClient.trigger({
            url:`${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body:{
                subscriptionId:subscription.id
            },
            headers:{
                'Content-Type':'application/json'
            },
            retries:0,
        })
        // LOCAL TESTING URL WITH UPSTASH
        // npx @upstash/qstash-cli-dev
        res.status(201).json({
            success:true,
            data:{subscription,
                workflowRunId
            }
        })
    } catch (error) {
        console.log("Error Happening in here")
        next(error)
    }
}

export const getUserSubscriptions = async(req,res,next)=>{
    try {
        
        if(req.user.id!== req.params.id){
            const error = new Error("YOu are not the owner of this account");
            error.status = 401;

            throw error;
        }
        const subscriptions = await Subscription.find({user:req.params.id})

        res.status(201).json({success:true, data:subscriptions})
    } catch (error) {
        next(error)
    }
}