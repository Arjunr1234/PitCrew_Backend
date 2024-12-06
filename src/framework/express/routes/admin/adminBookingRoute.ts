import express from 'express';
import AdminRepository from '../../../../interface_adapters/repository/adminRepository';
import AdminBookingInteractor from '../../../../usecases/admin/adminBooking';
import AdminBookingController from '../../../../interface_adapters/controllers/admin/adminBooking';
const adminBookingRoute = express.Router();


const repository = new AdminRepository();
const interactor = new AdminBookingInteractor(repository);
const controller = new AdminBookingController(interactor);


adminBookingRoute.get('/get-all-bookings', controller.getAllBookings.bind(controller))





export default adminBookingRoute