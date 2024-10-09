import express from 'express';
import AdminRepository from '../../../../interface_adapters/repository/adminRepository';
import AdminUserInteractor from '../../../../usecases/admin/adminUser';
import AdminUserCotroller from '../../../../interface_adapters/controllers/admin/adminUser';



const adminUserRouter = express.Router();
const repository = new AdminRepository();
const interactor = new AdminUserInteractor(repository);
const controller = new AdminUserCotroller(interactor);

//=============Routes=========================//

adminUserRouter.get('/get-user', controller.getUser.bind(controller));
adminUserRouter.patch('/user-block-unblock', controller.userBlockAndUnblock.bind(controller))



export default adminUserRouter