import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//add new admin
export const addAdmin= async(req,res)=>{
 const {email,password}=req.body;
 let existingAdmin;
 try {
    existingAdmin= await Admin.findOne({email})
 } catch (error) {
    console.log(error)
 }
 if (existingAdmin){
    return res.status(400).json({message:"Admin already exists"})
 }
const hashedPassword = bcrypt.hashSync(password)
let admin;

try {
    admin=new Admin({email,password:hashedPassword});
    admin=await admin.save()
} catch (error) {
    console.log(error)
}
if(!admin){
    return res.status(500).json({message:"Unexpected Error Occured"})
}
return res.status(201).json({admin})
}

//login admin
export const login =async(req,res)=>{
    const {email,password}=req.body;
    if(!email===" " && !password===" "){
        return res.status(422).json({message:"Invalid Inputs"})
    }
    let existingAdmin;
    try {
        existingAdmin= await Admin.findOne({email})
    } catch (error) {
        console.log (error)
    }
    if(!existingAdmin){
        return res.status(400).json({message:"Admin not found"})
    }

    const correctpassword=bcrypt.compareSync(password,existingAdmin.password)

    if(!correctpassword){
        return res.status(400).json({message:"Invalid Password"})
    }

    const token=jwt.sign({id:existingAdmin._id},process.env.SECRET_KEY,{
        expiresIn:"365d",
    })

    return res.status(200).json({message:"Login successful",token,id:existingAdmin._id})
}

//get all admins
export const getAllAdmins =async(req,res)=>{
    let admins;
    try{
        admins= await Admin.find();
    }catch(error){
        console.log(error);
    }

    if (!admins){
        return res.status(500).json({message:"Unexpected Error Occured"})
    }

    return res.status(200).json({admins});
}
