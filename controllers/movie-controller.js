import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Movie from "../models/Movie.js";
import Admin from "../models/Admin.js";

export const addMovie=async(req,res)=>{
    const extractedToken=req.headers.authorization.split(" ")[1];
    if (!extractedToken ===""){
        return res.status(403).json({message:"Token Not Found"})
    }

    //jwt verification
   let adminId;
    jwt.verify(extractedToken,process.env.SECRET_KEY,(error,decrypted)=>{
        if(error){
            res.status(400).json({message:`${error.message}`})
        }else{
            adminId=decrypted.id;
            return
        }
    })
    //create new movie

    const{title,description,cast,releaseDate,posterUrl}=req.body;
    if(!title === " " && !description === " " && !cast === " " && !posterUrl === " "){
        return res.status(404).json({message:"Invalid Inputs"});
    }

    let movie;
    try {
        movie=new Movie({title,description,cast,releaseDate:new Date(`${releaseDate}`),posterUrl,admin:adminId});
        const session=await mongoose.startSession();
        const adminUser= await Admin.findById(adminId);
        session.startTransaction()
        await movie.save({session});
        adminUser.addedMovies.push(movie);
        await adminUser.save({session});
        await session.commitTransaction();
    } catch (error) {
        return console.log(error);
    }

    if(!movie){
        return res.status(500).json({message:"Request Failed"})
    }
    return res.status(200).json({movie})
}

//get all movies

export const getAllMovies =async(req,res)=>{
    let movies;
    try{
        movies= await Movie.find();
    }catch(error){
        console.log(error);
    }

    if (!movies){
        return res.status(500).json({message:"Unexpected Error Occured"})
    }

    return res.status(200).json({movies});
}

//get movies by id
export const getMovieById=async(req,res)=>{
    const id=req.params.id;
    let movie;

    try {
        movie=await Movie.findById(id)
        
    } catch (error) {
        return console.log(error)
    }

    if(!movie){
        return res.status(404).json({message:"Movie not found"})
    }
    return res.status(200).json({movie})

}