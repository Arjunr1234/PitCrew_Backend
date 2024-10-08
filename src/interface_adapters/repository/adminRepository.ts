import { response } from "express";
import IAdminRepository from "../../entities/irepository/iAdminRepository";
import { IAdminLoginData, IAdminLoginResponse, IProviders, userData } from "../../entities/rules/admin";
import adminModel from "../../framework/mongoose/model/adminSchema";
import providerModel from "../../framework/mongoose/model/providerSchema";
import userModel from "../../framework/mongoose/model/userSchema";


class AdminRepository implements IAdminRepository{
    
    async loginRepo(loginData: IAdminLoginData): Promise<{ success: boolean; message?: string; adminData?: IAdminLoginResponse;}> {
       const {email, password} = loginData
       const loginResponse = await adminModel.findOne({
          email
       })
      

       if(!loginResponse){
          return {success:false, message:"userNotExists"}
       }

       if(loginResponse.password !== password){
         return {success:false, message:"incorrectPassword"}
       }
       const adminD = {
        _id:loginResponse._id.toString(),
        email:loginResponse.email,
        
       }
      
        return {success:true,adminData:adminD}
    }

   async getUsersRepo(): Promise<{ success: boolean; users?: userData[] | []; active?: number; blocked?: number; }> {
        
            try {
              
              const usersData = await userModel.find({}).sort({_id:-1});


              if(!usersData){
                 return {success:true, users:[]}
              }
 
              const [{ active, blocked }] = await userModel.aggregate([{
               $group: {
                   _id: null,
                   
                   active: { $sum: { $cond: [{ $eq: ["$blocked", false] }, 1, 0] } },
                   blocked: { $sum: { $cond: [{ $eq: ["$blocked", true] }, 1, 0] } }
               }
           }]);
 
           const updatedUsers :userData[] = usersData.map((user) => ({
               id:user.id.toString(),
               name:user.name,
               email:user.email,
               phone:user.phone,
               blocked:user.blocked
           }))
            console.log("This is the active and blocked Users In repo: ", active, blocked)
             return {success:true, users:updatedUsers, active:active, blocked:blocked}
            } catch (error) {
                console.log(error)
                return {success:false, users:[]}
            }
    }

    async adminBlockUnblockUser(id: string, state: boolean): Promise<{ success: boolean; message?: string }> {
      try {
          console.log('Blocking/Unblocking user with id: ', id);
          const blockResponse = await userModel.findByIdAndUpdate(id, { $set: { blocked: state } });
          console.log("This is the blockResponse: ", blockResponse);
  
          if (!blockResponse) {
              return { success: false, message: "User not found" };
          }
  
          return { success: true, message: state ? "User blocked successfully" : "User unblocked successfully" };
  
      } catch (error: any) {
          console.log('Error in block/unblock operation: ', error);
          return { success: false, message: "An error occurred while updating the user state" };
      }
  }

  async getPendingProvidersRepo(): Promise<{ success: boolean; providers?: IProviders[] | []; message?: string; }> {
         try {
                const provider:IProviders[] = await providerModel.aggregate([
                  {
                     $match:{
                        requestAccept:false
                     }
                  },
                  {$sort:{_id:-1}},
                  {
                    $project:{
                      _id:1,
                      workshopName:1,
                      ownerName:1,
                      mobile:1,
                      email:1,
                      workshopDetails:1,
                      blocked:1,
                      requestAccept:1
                    }
                  }
                ])
                
               if(!provider){
                 return {success:false, providers:[]}
               }

                 return {success:true, providers:provider}
                
         } catch (error:any) {
             console.log(error)
             return {success:false, message:"something wrong happend"}
          
         }
  }

  async getProvidersRepo(): Promise<{ success: boolean; providers?: IProviders[] | []; message?: string; }> {
    try {
      const provider: IProviders[] = await providerModel.aggregate([
        {
          $match: {
            requestAccept: true
          }
        },
        { $sort: { _id: -1 } },
        {
          $project: {
            _id: 1,
            workshopName: 1,
            ownerName: 1,
            mobile: 1,
            email: 1,
            workshopDetails: 1,
            blocked: 1,
            requestAccept: 1
          }
        }
      ])

      if (!provider) {
        return { success: false, providers: [] }
      }

      return { success: true, providers: provider }

    } catch (error: any) {
      console.log(error)
      return { success: false, message: "something wrong happend" }

    }
  }


}

export default AdminRepository;