import mongoose from "mongoose";
import Booking from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import Bookings from "../models/Bookings.js";

//new bookings

export const newBookings = async(req,res)=>{
    const {movie,date,seatNumber,user} = req.body;

    let existingMovie;
    let existingUser;
    try {
        existingMovie= await Movie.findById(movie);
        existingUser=await User.findById(user);

    } catch (error) {
        return console.log(error)
    }
    if(!existingMovie){
        return res.status(404).json({message: "Movie not found with given Id"})
    }if(!existingUser){
        return res.status(404).json({message: "User not found with given Id"})
    }

    let newBookings;
    
    try {
        newBookings=new Bookings({movie,date:new Date(`${date}`),seatNumber,user});
        const session= await mongoose.startSession();
        session.startTransaction();
        existingUser.bookings.push(newBookings);
        existingMovie.bookings.push(newBookings);
        await existingUser.save({session})
        await existingMovie.save({session})
        await newBookings.save({session})
        session.commitTransaction();
    } catch (error) {
        return console.log(error)
    }
    if(!newBookings){
        return res.status(500).json({message:"unable to create bookings"})
    }
    return res.status(200).json({booking:newBookings})
}

export const getBookings= async(req, res) =>{
    const id = req.params.id;
    let bookings;
    try{
        bookings= await Bookings.findById(id);
    }catch(error){
        console.log(error);
    }

    if (!bookings){
        return res.status(500).json({message:"Unexpected Error Occured"})
    }

    return res.status(200).json({bookings});
}
export const deleteBookings= async(req, res) =>{
    const id=req.params.id;

    let booking;
    try {
        booking=await Bookings.findByIdAndRemove(id).populate("user movie")
        const session=await mongoose.startSession();
        session.startTransaction();
        await booking.user.bookings.pull(booking)
        await booking.movie.bookins.pull(booking)
        await booking.movie.save({session})
        await booking.user.save({session})
        session.commitTransaction();
    } catch (error) {
        console.log(error)
    }
    if(!booking){
        return res.status(500).json({message:"Something went wrong"})
    }
    return res.status(200).json({message:"Delested successfully"})
}



