import Bookings from "../models/Bookings.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"

// get all users
export const getAllusers=async(req,res) =>{
    let users;
    try{
        users= await User.find();
    }catch(error){
        console.log(error);
    }

    if (!users){
        return res.status(500).json({message:"Unexpected Error Occured"})
    }

    return res.status(200).json({users});
}

//to add a new user

export const signUp =async(req,res)=>{
const {name,email,password}=req.body;

if(!name  === "" &&
   !email === "" &&
   !password === "")
   {
    return res.status(420).json({message:"Invalid Inputs"});
}
const hashedPassword=bcrypt.hashSync(password)
let user;
try {
    user=new User({name,email,password:hashedPassword});
    user=await user.save()
} catch (error) {
   console.log(error)
}
if (!user){
    return res.status(500).json({message:"Unexpected Error Occured"})
}
return res.status(201).json({user})
}

//to update existing user
export const updateUser=async(req, res) => {
    const id=req.params.id;
    const {name,email,password}=req.body;

if(!name  === "" &&
   !email === "" &&
   !password === "")
   {
    return res.status(420).json({message:"Invalid Inputs"});
}

const hashedPassword = bcrypt.hashSync(password)
let user;
try {
    user= await User.findByIdAndUpdate(id,{name,email,password:hashedPassword});
} catch (error) {
    console.log(error);
}
if(!user){
    return res.status(500).json({message:"Something went wrong"})
}
return res.status(202).json({message:"Updated successfully"})
}

//delete a user

export const deleteUser = async(req, res) => {
    const id=req.params.id;

    let user;
    try {
        user=await User.findByIdAndRemove(id)
    } catch (error) {
        console.log(error)
    }
    if(!user){
        return res.status(500).json({message:"Something went wrong"})
    }
    return res.status(200).json({message:"Delested successfully"})
}

//login user

export const login =async(req,res)=>{
    const {email,password}=req.body;
    if(!email===" " && !password===" "){
        return res.status(422).json({message:"Invalid Inputs"})
    }
    let existingUser;
    try {
        existingUser= await User.findOne({email})
    } catch (error) {
        console.log (error)
    }
    if(!existingUser){
        return res.status(400).json({message:"User not found"})
    }

    const correctpassword=bcrypt.compareSync(password,existingUser.password)

    if(!correctpassword){
        return res.status(400).json({message:"Invalid Password"})
    }

    return res.status(200).json({message:"Login successful",id:existingUser._id})
}

export const getBookings=async(req, res) => {
    const id=req.params.id;
    let booking;

    try {
        booking=await Bookings.find({user:id}).populate("user").populate("movie")
        
    } catch (error) {
        return console.log(error)
    }

    if(!booking){
        return res.status(404).json({message:"unable to get booking"})
    }
    return res.status(200).json({booking})

}