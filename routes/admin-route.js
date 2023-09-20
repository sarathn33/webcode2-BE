import express from 'express';
import { addAdmin, getAllAdmins, login } from '../controllers/admin-controller.js';


const adminRouter=express.Router();

adminRouter.get('/',getAllAdmins)
adminRouter.post('/signup',addAdmin)
adminRouter.post('/login',login)


export default adminRouter;