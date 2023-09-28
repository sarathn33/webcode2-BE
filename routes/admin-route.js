import express from 'express';
import { addAdmin, getAdminsById, getAllAdmins, login } from '../controllers/admin-controller.js';


const adminRouter=express.Router();

adminRouter.get('/',getAllAdmins)
adminRouter.get('/:id',getAdminsById)
adminRouter.post('/signup',addAdmin)
adminRouter.post('/login',login)


export default adminRouter;