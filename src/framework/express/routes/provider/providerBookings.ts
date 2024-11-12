import express from "express";
import ProviderRepository from "../../../../interface_adapters/repository/providerRepository";
import ProviderBookingsInteractor from "../../../../usecases/provider/bookings";
import ProviderBookingsController from "../../../../interface_adapters/controllers/provider/providerBookings";

const providerBookingsRoute = express.Router()





const repository = new ProviderRepository();
const interactor = new ProviderBookingsInteractor(repository);
const controller = new ProviderBookingsController(interactor);



//======================= Routes ===================================


providerBookingsRoute.post('/add-slot', controller.addSlot.bind(controller));

providerBookingsRoute.get('/get-all-slot', controller.getAllSlot.bind(controller));


export default providerBookingsRoute
