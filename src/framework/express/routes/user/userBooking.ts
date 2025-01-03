import express from 'express';
import UserRepository from '../../../../interface_adapters/repository/userRepository';
import UserBookingInteractor from '../../../../usecases/user/booking';
import UserBookingController from '../../../../interface_adapters/controllers/user/userBooking';
import verification from '../../middleware/jwtAuthentication';
import { role } from '../../../../entities/rules/constants';

const userBookingRoute = express.Router();




const repository = new UserRepository();
const interactor = new UserBookingInteractor(repository);
const controller = new UserBookingController(interactor);

//========================== Routes ==========================

userBookingRoute.post('/service-booking-payment',verification(role.user), controller.serviceBookingPayment.bind(controller));
userBookingRoute.post('/add-rating', controller.addRating.bind(controller));

userBookingRoute.get('/check-avaliable-slot',verification(role.user), controller.checkAvaliableSlot.bind(controller));
userBookingRoute.get('/get-all-bookings', controller.getAllBookings.bind(controller));
userBookingRoute.get('/get-notification', controller.getNotification.bind(controller));


userBookingRoute.put('/cancell-booking', controller.cancellBooing.bind(controller))

userBookingRoute.patch('/change-payment-status-success',verification(role.user), controller.successfullPaymentStatusChange.bind(controller));
userBookingRoute.patch('/notification-seen', controller.seenNotification.bind(controller));
userBookingRoute.patch('/clear-notification', controller.clearNotification.bind(controller))





export default userBookingRoute