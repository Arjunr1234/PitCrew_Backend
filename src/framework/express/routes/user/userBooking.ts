import express from 'express';
import UserRepository from '../../../../interface_adapters/repository/userRepository';
import UserBookingInteractor from '../../../../usecases/user/booking';
import UserBookingController from '../../../../interface_adapters/controllers/user/userBooking';

const userBookingRoute = express.Router();




const repository = new UserRepository();
const interactor = new UserBookingInteractor(repository)
const controller = new UserBookingController(interactor);

//========================== Routes ==========================

userBookingRoute.post('/service-booking-payment', controller.serviceBookingPayment.bind(controller));

userBookingRoute.get('/check-avaliable-slot', controller.checkAvaliableSlot.bind(controller));

userBookingRoute.patch('/change-payment-status-success', controller.successfullPaymentStatusChange.bind(controller))





export default userBookingRoute