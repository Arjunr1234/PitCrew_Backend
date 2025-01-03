import express from "express";
import ProviderRepository from "../../../../interface_adapters/repository/providerRepository";
import ProviderBookingsInteractor from "../../../../usecases/provider/bookings";
import ProviderBookingsController from "../../../../interface_adapters/controllers/provider/providerBookings";
import verification from "../../middleware/jwtAuthentication";
import { role } from "../../../../entities/rules/constants";

const providerBookingsRoute = express.Router()





const repository = new ProviderRepository();
const interactor = new ProviderBookingsInteractor(repository);
const controller = new ProviderBookingsController(interactor);



//======================= Routes ===================================


providerBookingsRoute.post('/add-slot',verification(role.provider), controller.addSlot.bind(controller));

providerBookingsRoute.get('/get-all-slot', controller.getAllSlot.bind(controller));
providerBookingsRoute.get('/get-all-bookings', controller.getAllBookings.bind(controller));
providerBookingsRoute.get('/get-single-booking', controller.getSingleBooking.bind(controller));
providerBookingsRoute.get('/dashboard-details', controller.getDashboardDetails.bind(controller))

providerBookingsRoute.patch('/update-slot',verification(role.provider), controller.updateSlotCount.bind(controller));
providerBookingsRoute.patch('/change-status', controller.changeBookingStatus.bind(controller))

providerBookingsRoute.delete('/remove-slot',verification(role.provider), controller.removeSlot.bind(controller));



export default providerBookingsRoute
