import express from 'express';
import ProviderRepository from '../../../../interface_adapters/repository/providerRepository';
import ProviderProfileInteractor from '../../../../usecases/provider/profile';
import CloudinaryService from '../../../service/cloudinary';
import ProviderProfileController from '../../../../interface_adapters/controllers/provider/providerProfile';
import { upload } from '../../../service/multer';
import verification from '../../middleware/jwtAuthentication';
import { role } from '../../../../entities/rules/constants';


const providerProfileRoute = express.Router();



const  repository = new ProviderRepository();
const cloudinary = new CloudinaryService();
const interactor =  new ProviderProfileInteractor(repository, cloudinary);
const controller = new ProviderProfileController(interactor);

//=============== Route =======================//

providerProfileRoute.get('/get-provider-details',verification(role.provider), controller.getProviderDetails.bind(controller))

providerProfileRoute.put('/edit-profile',verification(role.provider), controller.editProfile.bind(controller));

providerProfileRoute.post('/update-profile-pic',verification(role.provider), upload.single('image'), controller.updateProfilePic.bind(controller))

export default providerProfileRoute