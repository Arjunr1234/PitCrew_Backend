import express from 'express';
import UserRepository from '../../../../interface_adapters/repository/userRepository';
import UserProfileInteractor from '../../../../usecases/user/profile';
import UserProfileController from '../../../../interface_adapters/controllers/user/userProfile';
import CloudinaryService from '../../../service/cloudinary';
import { upload } from '../../../service/multer';
import verification from '../../middleware/jwtAuthentication';
import { role } from '../../../../entities/rules/constants';

const userProfileRoute = express.Router()



const repository = new UserRepository();
const cloudinary = new CloudinaryService()
const interactor = new UserProfileInteractor(repository, cloudinary)
const controller = new UserProfileController(interactor);

//=============== Routes =====================//

userProfileRoute.get('/get-user',verification(role.user), controller.getUserDetails.bind(controller));

userProfileRoute.patch('/edit-profile',verification(role.user), controller.editUserProfile.bind(controller));

userProfileRoute.put('/add-profile-pic',verification(role.user), controller.updateImage.bind(controller));
userProfileRoute.put('/reset-password', controller.resetPassword.bind(controller))

userProfileRoute.post('/update-profile-img',verification(role.user), upload.single('image'), controller.updateProfileImage.bind(controller))


export default userProfileRoute