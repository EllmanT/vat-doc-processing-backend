import { Router } from "express"
import { processDocument } from "../controllers/docProcessing.controller.js"
import multer from "multer"
const upload = multer({ storage: multer.memoryStorage() });
const docProcessingRouter =  Router()
docProcessingRouter.post('/',upload.single("file"),processDocument)



export default docProcessingRouter;
