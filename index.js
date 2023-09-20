import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"
import userRouter from "./routes/user-route.js";
import adminRouter from "./routes/admin-route.js";
import movieRouter from "./routes/movie-route.js";
import bookingRoute from "./routes/booking-route.js";

//configuration
dotenv.config();
const app = express();
app.use(cors())


//middlewares
app.use(express.json());
app.use("/user",userRouter)
app.use("/admin",adminRouter)
app.use("/movie",movieRouter)
app.use("/booking",bookingRoute)


//connections
mongoose.connect(process.env.MONGO,{useNewUrlParser:true})
.then(()=>{
    console.log("Database connected successfully")
}).catch((error)=>{
    console.log("Error connecting database",error)
})


app.listen(8080,()=>{
    console.log("Server is running in port 8080")
 });