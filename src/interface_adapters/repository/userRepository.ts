import iUserRepository from "../../entities/irepository/iuserRepository";
import userModel from "../../framework/mongoose/model/userSchema";
import OtpModel from "../../framework/mongoose/model/otpSchema";
import { IBrandData, IDetails, IProfileData, IProvidersData, IServiceData, IUserData, user, userResponseData, userSignIn } from "../../entities/rules/user";
import bcrypt from 'bcrypt';
import serviceModel from "../../framework/mongoose/model/serviceSchema";
import brandModel from "../../framework/mongoose/model/brandSchema";
import providerModel from "../../framework/mongoose/model/providerSchema";
import mongoose, { ObjectId } from "mongoose";
import providerServiceModel from "../../framework/mongoose/model/providerServiceSchema";
import BookingSlot from "../../framework/mongoose/model/BookingSlotSchema";
import BookingModel from "../../framework/mongoose/model/BookingSchema";
import { IRatingData } from "../../entities/rules/provider";
import RatingModel from "../../framework/mongoose/model/ratingSchema";
import notificationModel from "../../framework/mongoose/model/notificationSchema";
import { sendBookingNotification } from "../../framework/config/socketIO";

class UserRepository implements iUserRepository {

  async tempOTp(otp: string, email: string): Promise<{ created: boolean }> {
    console.log("Entered in temp otp in userRepository");
    const newotp = await OtpModel.create({
      email: email,
      otp: otp
    });
    if (newotp) {
      return { created: true };
    }
    return { created: false };
  }
  
  async userexist(email: string): Promise<boolean> {
    const userExist = await userModel.findOne({ email: email });
    console.log(userExist);
    return !!userExist;
  }

  async phoneExist(phone:string):Promise<boolean>{
      const phoneExist = await userModel.findOne({phone:phone})
      return !!phoneExist
  }

  async otpVerification(email: string, otp: string): Promise<boolean> {
    const otpverifed = await OtpModel.findOne({ otp: otp, email: email });
    console.log("otpverfied", otpverifed);
    return otpverifed !== null;
  }

  async signup(userData: user): Promise<{ user: userResponseData; created: boolean; }> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const createUser = await userModel.create({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: hashedPassword, 
      blocked: false
    });

    const user = {
      id: createUser._id.toString(),
      name: createUser.name,
      email: createUser.email,
      mobile: createUser.phone.toString(),
      blocked: createUser.blocked,
      image:createUser.imageUrl
    };

    if (createUser) {
      return { user: user, created: true };
    } else {
      return { user: user, created: false };
    }
  }

  async login(userData: userSignIn): Promise<{ user?: userResponseData; success: boolean; message?: string; }> {
      const user = await userModel.findOne({email:userData.email});
      

      if(user?.blocked){
        return {success:false, message:"You are blocked!!"}
      }
      if(!user){
        return {success:false, message:"wrong email"}
      }
      
      
      const passwordMatch = await bcrypt.compare(userData.password, user.password);
        
      if (!passwordMatch) {
         return {success:false, message:"wrong password"}
      }

      
      const userinfo: userResponseData = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          mobile: user.phone + "" ,
          blocked: user.blocked,
          image:user.imageUrl
      };

      
      return { user: userinfo, success: true };
  }



  async getAllServiceRepo(): Promise<{ success: boolean; serviceData?: IServiceData[]; message?: string }> {
    try {
        const getAllservice = await serviceModel.find({});

        if (!getAllservice || getAllservice.length === 0) {
            return { success: false, message: "Failed to find services" };
        }

        const data: IServiceData[] = getAllservice.map((service) => ({
            id: service._id + "",
            category: service.category,
            serviceType: service.serviceType,
            imageUrl: service.imageUrl,
            isActive: service.isActive
        }));

        return { success: true, serviceData: data };
    } catch (error) {
        console.log("Error occurred in getAllServiceRepo: ", error);
        return { success: false, message: "An error occurred while fetching services" };
    }
}

 async getAllBrandRepo(): Promise<{ success: boolean; message?: string; brandData?: IBrandData[]; }> {
     
      try {
           const response = await brandModel.find({});
           if(!response){
             return {success:false, message:"Failed to find!!"}
           }
          
           
           const data :IBrandData[] = response.map((brand) => ({
                 brandName:brand.brand,
                 id:brand._id+""
           }))
           console.log("This is the resposne: ", response);
           
           return {success:true, brandData:data}
           
        
      } catch (error) {
           console.log("Error in getAllBrandRepo: ",error)
           return {success:false, message:"Something went wrong in getAllBrandRepo"}
      }
 }


async findProvidersRepo(data: IDetails): Promise<{ success: boolean; message?: string; providersData?: IProvidersData[] | []; }> {
  try {
    const { serviceId, vehicleBrand, vehicleType, location } = data;
    const { id: brandId } = vehicleBrand;  
    const { coordinates } = location;  
    
    
    

    const response = await providerModel.aggregate([
      
      {
        $geoNear: {
          near: { type: "Point", coordinates: coordinates },  
          distanceField: "distance",
          maxDistance: 10000,  
          spherical: true
        }
      },
      {
        $match: {
          "supportedBrands.brandId": brandId,  
          blocked: false
        }
      },
      {
        $lookup: {
          from: "providerservices",
          localField: "_id",
          foreignField: "workshopId",
          as: "services"
        }
      },
      {
        $match: {
          [`services.${vehicleType}`]: { 
            $elemMatch: {
              "typeId":new mongoose.Types.ObjectId(serviceId.toString())
            }
          }
        }
      },
      {
        $project: {
          _id:1,
          workshopName: 1,
          ownerName: 1,
          workshopDetails:1,
          email: 1,
          mobile: 1,
          
        }
      }
    ])
    
    if(!response){
       return {success:false, message:"Cannot find the Providers"}
    }
   

    const datas :IProvidersData[] = response.map((service) => ({
           id:service._id + "",
           workshopName:service.workshopName,
           ownerName:service.ownerName,
           email:service.email,
           mobile:service.mobile,
           address:service.workshopDetails.address,
           coordinates:service.workshopDetails.location.coordinates
    }))
    

    console.log("Thisis the datas: ", datas)

  
      return {success:true, providersData:datas}

     

  } catch (error) {
    console.log("Error in findProvidersRepo: ", error);
    return { success: false, message: "Something went wrong in findProvidersRepo" };
  }
}

async providerServiceViewRepo(providerId: string, vehicleType: string, serviceId:string): Promise<{ success: boolean; message?: string; providerData?: any, serviceData?:any }> {
  try {
      console.log("Enter in to provider ServiceVewRepo providerId and vehicleType: ", providerId, vehicleType, serviceId);


      const findedService = await serviceModel.findOne({_id:new mongoose.Types.ObjectId(serviceId)})

      const providerDetails = await providerServiceModel.aggregate([
      
        {
            $match: { workshopId: new mongoose.Types.ObjectId(providerId) }
        },
        
        {
            $lookup: {
                from: "providers",
                localField: "workshopId",
                foreignField: "_id",
                as: "providerDetails"
            }
        },
        
        {
            $unwind: "$providerDetails"
        },
        
        {
            $project: {
              _id: 1,
              workshopId: 1,
              "providerDetails._id": 1,
              "providerDetails.workshopName":1,
              "providerDetails.ownerName":1,
              "providerDetails.email":1,
              "providerDetails.mobile":1,
              "providerDetails.workshopDetails":1,
              "providerDetails.about":1,
              "providerDetails.logoUrl":1,
              services: vehicleType === "twoWheeler" ? "$twoWheeler" : "$fourWheeler",

            }
        },
        
        {
            $unwind: "$services"
        },
        {
          $match: { "services.typeId": new mongoose.Types.ObjectId(serviceId) } 
        }
        
        
    ])
    

      if(!providerDetails){
        return {success:false, message:"Can't find service of providers"}
      }

      return { success: true, providerData: providerDetails[0], serviceData:findedService };

  } catch (error) {
      console.log("Error in providerServiceViewRepo: ", error);
      return { success: false, message: "Something went wrong in providerServiceViewRepo" };
  }
}

async checkAvaliableSlotRepo(providerId: string, date: string): Promise<{success:boolean, message?:string, slotId?:string}> {
    try {
        console.log("This is the date: " ,date )
        const selectedDate = new Date(date);

        console.log("This is selected date: ", selectedDate)
        const nextDate = new Date(selectedDate)
        nextDate.setDate(selectedDate.getDate() + 1)
        console.log("This is next date: ", nextDate)

        const slot = await BookingSlot.findOne({ 
          providerId,
          date: { $gt: selectedDate, $lte: nextDate },
          count: { $gt: 0 },
          $expr: { $gt: ["$count", "$bookedCount"] }
        });
        

        if(!slot){
           return {success:false, message:"No slot is avaliable"}
        }

        const avaliableSlot = slot.count - slot.bookedCount
        
        return {success:true, message:`${avaliableSlot} is avaliable`, slotId:slot._id+""}
      
    } catch (error) {
        console.log("Error in checkAvaliableSlot: ",error);
        return {success:false, message:"Something went wrong in checkAvaliableSlot"}
      
    }
}



async  serviceBookingRepo(data: any): Promise<{success:boolean, message?:string, bookingDetails?:any}> {
  try {
    console.log("This is the serviceBookingData in Repo:", data);
    /////////////////////////////////////////////////////////////
    const slotId = new mongoose.Types.ObjectId(data.slotId);

    // Query the BookingSlot collection
    const getSlot = await BookingSlot.findOne({ _id: slotId });

    if (!getSlot) {
        console.log("No slot found for the given ID");
        
    }

    const bookingDate = getSlot?.date ?? new Date();
    //console.log("This is the bookingDate: ", new Date(bookingDate));
    ////////////////////////////////////////////////////////////////
    
    const bookingData = {
      serviceType: 'general', 
      userId: new mongoose.Types.ObjectId(data.userId),
      providerId: new mongoose.Types.ObjectId(data.providerId),
      slotId: new mongoose.Types.ObjectId(data.slotId),
      serviceId: new mongoose.Types.ObjectId(data.vehicleDetails.serviceId), 

      vehicleDetails: {
        number: data.vehicleDetails.vehicleNumber,
        model: data.vehicleDetails.vehicleModel,
        brand: data.vehicleDetails.vehicleBrand.brandName,
        kilometersRun: data.vehicleDetails.kilometers,
        fuelType: data.vehicleDetails.fuelType.toLowerCase() === 'petrol' ? 'petrol' : 'diesel',
        vehicleType: data.vehicleDetails.vehicleType === 'twoWheeler' ? 'twoWheeler' : 'fourWheeler',
      },

      location: {
        address: data.vehicleDetails.location.place_name,
        coordinates: data.vehicleDetails.location.coordinates,
      },

      userPhone: data.userPhone,
      bookingDate: bookingDate, 
      amount: data.totalPrice,
      platformFee:data.platformFee,
      subTotal:(data.totalPrice + data.platformFee),
      paymentId: '', 
      reason: '',
      status: 'pending', 

      
      selectedSubServices: data.selectedServices.map((service: any) => ({
        type: service.type,
        startingPrice: service.startingPrice,
        _id: new mongoose.Types.ObjectId(service._id),
        isAdded: service.isAdded,
      })),

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    
    const serviceBooking = await BookingModel.create(bookingData);

    if (!serviceBooking) {
      return { success: false, message: "Failed to book service in repo" };
    }

   

    return { success: true, bookingDetails: serviceBooking };
  } catch (error) {
    console.error("Error in serviceBookingRepo:", error);
    return { success: false, message: "Something went wrong in serviceBookingRepo" };
  }
}


async updateBooking(paymentIntent: string, bookingId: string): Promise<{ success: boolean; message?: string; }> {
      try {
            const updateBooking = await BookingModel.findByIdAndUpdate(
              bookingId,
              {
                paymentId:paymentIntent,
                paymentStatus:"success"
              },
              {new:true}
            )

            if(!updateBooking){
              return{success:false, message:"Failed to updateBooking"}
            }

            const slotId = updateBooking.slotId;
            const providerId = updateBooking.providerId  ;
            

            const updateBookingSlot = await BookingSlot.findOneAndUpdate(
                               {providerId:providerId,_id:slotId},
                               {
                                 $inc:{bookedCount:1}
                               },
                               {new:true}
            )

            if(!updateBookingSlot){
               return {success:false, message:"Failed to update Booking slot"}
            }

            const service = await serviceModel.findById(updateBooking.serviceId);
            const user = await userModel.findById(updateBooking.userId)

            //console.log("This is that servcie:   ", service)

            const userNotificationContent = {
              content: `Your ${service?.serviceType} booked successfully `,
              type: "booking",  
              read: false,
              bookingId:bookingId
          };
           const providerNotificationContent = {
              content: `${user?.name} has booked a ${service?.serviceType}`,
              type:"booking",
              read:false, 
              bookingId:bookingId
           }
          
          const createUserNotification = await notificationModel.findOneAndUpdate(
            {receiverId:new mongoose.Types.ObjectId(updateBooking.userId)},
            {$push:{notifications:userNotificationContent}},
            {new:true, upsert:true}
          );
          const createProviderNotification = await notificationModel.findOneAndUpdate(
            {receiverId:new mongoose.Types.ObjectId(updateBooking.providerId)},
            {$push:{notifications:providerNotificationContent}},
            {new:true, upsert:true}
          );

          await sendBookingNotification(providerId.toString(), providerNotificationContent)

          

          if(!createUserNotification || !createProviderNotification){
             return {success:false, message:"Something went wrong in create Notification"}
          }



            return {success:true, message:"updated"}
        
      } catch (error) {
          console.log("Error in updateBooking: ",error);
          return {success:false, message:"something went wrong in updateBooking"}
        
      }
}


async getUserDetailsRepo(userId: string): Promise<{ success: boolean; message?: string; userData?: IUserData; }> {
    try {
           
           const userDetails = await userModel.findOne({_id:userId});

           if(!userDetails){
              return {success:false, message:"Failed to fetch userDetails"}
           }

           const userData = {
              _id:userDetails._id+"",
              name:userDetails.name,
              phone:userDetails.phone,
              email:userDetails.email,
              imageUrl:userDetails.imageUrl?userDetails.imageUrl:""
           }

           return {success:true, userData:userData}
      
    } catch (error) {
        console.log("Error in getUserDetails: ", error);
        return {success:true, message:"Something went wrong in getUserDetails"}
      
    }
}

async editUserProfileRepo(data: IProfileData): Promise<{ success: boolean; message?: string; }> {
    try {
        const {userId, phone, name} = data

        const updateUser = await userModel.findByIdAndUpdate(
              userId,
              {
                $set:{
                   name:name,
                   phone:phone,
                }
              }
        )
        if(!updateUser){
           return {success:false, message:"Failed to update profile data"}
        }

        return {success:true,}
      
    } catch (error) {
        console.log("Error in editUserProfile: ", error)
        return {success:false, message:"Something went wrong in editUserProfileRepo"}
    }
}

async updateProfileImageRepo(userId: string, imageUrl: string): Promise<{ success: boolean; message?: string; prevImgUrl?: string | null; newImgUrl?: string; }> {
    try {

         const oldImage = await userModel.findById(userId).select('imageUrl');

         const updateImage = await userModel.findByIdAndUpdate(
                                  userId,
                                  {
                                    $set:{
                                      imageUrl:imageUrl
                                    }
                                  },
                                  {new:true}
         );

         if(!updateImage){
           return {success:false, message:"Failed to update image"}
         }

          return{success:true, newImgUrl:updateImage.imageUrl, prevImgUrl:oldImage?.imageUrl}
      
    } catch (error) {
        console.log("Error in updateProfileImageRepo: ", error);
        return {success:false, message:"Something went wrong updateProfileImageRepo"}
      
    }
}

 async getAllBookingsRepo(userId: string): Promise<{ success: boolean; message?: string; bookingData?: any; }> {
     try {
            console.log("This is userId: ", userId)
            const fetchedBookings = await BookingModel.aggregate([
              {
                $match: {
                  userId: new mongoose.Types.ObjectId(userId),
                  paymentStatus:"success",
                },
              },
              {
                $lookup: {
                  from: "services", 
                  localField: "serviceId", 
                  foreignField: "_id", 
                  as: "serviceDetails", 
                },
              },
              {
                $unwind: "$serviceDetails", 
              },
              {
                $lookup:{
                  from:"providers",
                  localField:"providerId",
                  foreignField:"_id",
                  as:"providerDetails"
                }
              },
              {
                $unwind:"$providerDetails"
              },
              {
                $lookup:{
                  from:"users",
                  localField:"userId",
                  foreignField:"_id",
                  as:"userDetails"
                }
              },
              {
                $unwind:"$userDetails"
              },
              {
                $project: {
                  _id: 1,
                  serviceType: 1,
                  userId: 1,
                  providerId: 1,
                  slotId: 1,
                  serviceId: 1,
                  vehicleDetails: 1,
                  location: 1,
                  userPhone: 1,
                  bookingDate: 1,
                  amount: 1,
                  platformFee: 1,
                  subTotal: 1,
                  paymentId: 1,
                  reason: 1,
                  paymentStatus: 1,
                  status: 1,
                  selectedSubServices: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  __v: 1,
                  serviceName:"$serviceDetails.serviceType", 
                  providerDetails: {
                    _id: 1,
                    workshopName: 1,
                    ownerName: 1,
                    workshopDetails:1,
                    email: 1,
                    mobile: 1, 
                    logoUrl:1   
                  },
                  userImage:"$userDetails.imageUrl"
                },
              },
            ]);
            console.log("This is the fetchedBookings: ", fetchedBookings)

            if(!fetchedBookings){
                return{success:false, message:"Failed to fetch all bookings"}
            }

                return {success:true, bookingData:fetchedBookings}
      
     } catch (error) {
        console.log("Error occured in getAllBookingsRepo: ", error);
        return{success:false, message:"Something went wrong in getAllBookingsRepo"}
      
     }
 }

 async  resetPasswordRepo(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{success:boolean, message?:string}> {
  try {
    
    const user = await userModel.findById(userId); 
    if (!user) {
      return { success: false, message: 'user is  not found' };
    }

    
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Current password is incorrect' };
    }

    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    
    user.password = hashedNewPassword;
    await user.save(); 

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    console.error('Error in resetPasswordRepo: ', error);
    return { success: false, message: 'Something went wrong in resetPasswordRepo' };
  }
}

 async getCancelledBookingRepo(bookingId: string): Promise<{ success: boolean; message?: string; bookingData?: any; }> {
    try {
       console.log(bookingId);
       
       const booking = await BookingModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(bookingId) } 
        },
        {
          $lookup: {
            from: "bookingslots", 
            localField: "slotId",  
            foreignField: "_id",   
            as: "slotDetails"     
          }
        },
        {
          $unwind:"$slotDetails"
        },
        {
          $project:{
            paymentId:1,
            serviceDate:"$slotDetails.date",
            amount:1,
            platformFee:1,
            subTotal:1
          }
        }
        
       
       ])
      // console.log("This si teh booking taken before cancell: ", booking)

       if(!booking){
          return {success:false, message:"Failed to fetch cancelled booking"}
       }
      
        return {success:true, message:"successfully fetched cancelled booking", bookingData:booking[0]}
      
    } catch (error) {
        console.log("Error occured in finding cancelled booking");
        return {success:false, message:"Something went wrong getCancelled bookingRepo"}
       
    }
}

async updateBookingAfterRefundRepo(bookingId: string, reason: string, refundAmount: number, refundStatus: string): Promise<{ success: boolean; message?: string; }> {
    try {
      
      const updateBooking = await BookingModel.findByIdAndUpdate(
         bookingId,
         {$set:{
          "refund.amount":refundAmount,
          "refund.status":refundStatus,
          reason:reason,
          status:"cancelled"
         },
        },
        {new:true}
         
      )

      if(!updateBooking){
        return {success:false, message:"Failed to update booking after refund"}
     }

     
      const updateSlot = await BookingSlot.findByIdAndUpdate(
        updateBooking.slotId,
        { $inc: { bookedCount: -1 } }, 
        { new: true }
      );
  
      if (!updateSlot) {
        return { success: false, message: "Failed to update slot count after cancellation" };
      }


      return{success:true, message:"Successfully updated booking after refund"}


    } catch (error) {
        console.log('Error in updateBookingAfterRefund: ', error);
        return {success:false, message:"Something went wrong in updateBookingAfterRefundRepo"}
      
    }
}



async addRatingRepo(ratingData: IRatingData): Promise<{ success: boolean; message?: string }> {
  try {
    
    const {bookingId, feedback, providerId,rating,serviceId, userId} = ratingData
    const data = {
      bookingId,
      userId,
      providerId,
      serviceId,
      rating,
      feedback
    }
    const newRating = await RatingModel.create(data);

    if (!newRating) {
      return { success: false,message: 'Failed to add rating and review'  };
    }

    const updateBooking = await BookingModel.findByIdAndUpdate(
         bookingId,
         {
          $set:{
            reviewAdded:true
          }
         },
         {new:true}
    )
   
    if(!updateBooking){
      return{success:false, message:"Failed to update isReviewAdded status"}
    }


    return { success: true, message: 'Rating and review added successfully.' };
  } catch (error) {
    console.error('Error in AddRatingRepo: ', error);
    return { success: false, message: 'Something went wrong in addRatingRepo.' };
  }
}

async getNotificationRepo(receiverId: string): Promise<{ success: boolean; message?: string; notificationData?: any; }> {
    try {

          const fetchNotification = await notificationModel.findOne({receiverId});

          

          if(!fetchNotification){
               return {success:false, message:"Failed to fetch notification"}
          } 

          return {success:true, notificationData:fetchNotification}
           
      
    } catch (error) {
        console.log("Error in getNotification userRepo");
        return {success:false, message:"Something went wrong in getNotificationRepo"}
      
    }
}

async seenNotificationRepo(notificationId: string): Promise<{ success: boolean; message?: string; }> {
  try {
      const updateSeen = await notificationModel.updateOne(
          { _id: notificationId }, 
          {
              $set: { "notifications.$[].read": true } 
          }
      );

      if (updateSeen.matchedCount === 0) {
          return { success: false, message: 'Document not found' };
      }

      return { success: true, message:"seen status updated successfully!!" };
  } catch (error) {
      console.error("Error in seenNotificationRepo: ", error);
      return { success: false, message: 'Something went wrong in seenNotification' };
  }
}

async clearNotificationController(receiverId: string): Promise<{ success: boolean; message?: string; }> {
  try {
    
    const result = await notificationModel.updateOne(
      { receiverId }, 
      { $set: { notifications: [] } } 
    );
    console.log("result", result)
    if (result.modifiedCount > 0) {
      return { success: true, message: "Notifications cleared successfully" };
    } else {
      return { success: false, message: "No notifications found for the given receiverId" };
    }
  } catch (error) {
    console.error("Error in clearNotificationController:", error);
    return { success: false, message: "Something went wrong in clearNotification" };
  }
}



}

export default UserRepository;
