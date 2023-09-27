import express from 'express';
import { deleteUser, getAllusers, getBookings, getUserById, login, signUp, updateUser } from '../controllers/user-controller.js';

const userRouter=express.Router();

userRouter.get("/",getAllusers);
userRouter.get("/:id",getUserById);
userRouter.post("/signup",signUp);
userRouter.put("/:id",updateUser);
userRouter.delete("/:id",deleteUser)
userRouter.post("/login",login)
userRouter.get("/booking/:id",getBookings)

export default userRouter;