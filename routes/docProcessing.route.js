import { Router } from "express"

const docProcessingRouter =  Router()
docProcessingRouter.post('/',(req,res)=>{
    res.send({title:'Process the document'})
})

export default docProcessingRouter;
