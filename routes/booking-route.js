import express from 'express';
import { deleteBookings, getBookings, newBookings } from '../controllers/booking-controller.js';


const bookingRoute=express.Router();

bookingRoute.get("/:id",getBookings)
bookingRoute.post("/",newBookings)
bookingRoute.delete("/:id",deleteBookings)

export default bookingRoute