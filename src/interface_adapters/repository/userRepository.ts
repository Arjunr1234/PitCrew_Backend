import iUserRepository from "../../entities/irepository/iuserRepository";
import userModel from "../../framework/mongoose/model/userSchema";
import OtpModel from "../../framework/mongoose/model/otpSchema";
import { IBrandData, IDetails, IProvidersData, IServiceData, user, userResponseData, userSignIn } from "../../entities/rules/user";
import bcrypt from 'bcrypt';
import serviceModel from "../../framework/mongoose/model/serviceSchema";
import brandModel from "../../framework/mongoose/model/brandSchema";
import providerModel from "../../framework/mongoose/model/providerSchema";
import mongoose, { ObjectId } from "mongoose";
import providerServiceModel from "../../framework/mongoose/model/providerServiceSchema";
import BookingSlot from "../../framework/mongoose/model/BookingSlotSchema";
import BookingModel from "../../framework/mongoose/model/BookingSchema";

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
      blocked: createUser.blocked
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
          blocked: user.blocked
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
           date:{$gt:selectedDate,$lte: nextDate},
           count:{$gt:0}
        })

        if(!slot){
           return {success:false, message:"No slot is avaliable"}
        }
        
        return {success:true, message:`${slot.count} is avaliable`, slotId:slot._id+""}
      
    } catch (error) {
        console.log("Error in checkAvaliableSlot: ",error);
        return {success:false, message:"Something went wrong in checkAvaliableSlot"}
      
    }
}



async  serviceBookingRepo(data: any): Promise<{success:boolean, message?:string, bookingDetails?:any}> {
  try {
    console.log("This is the serviceBookingData in Repo:", data);

    
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
      bookingDate: new Date(), 
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

            return {success:true, message:"updated"}
        
      } catch (error) {
          console.log("Error in updateBooking: ",error);
          return {success:false, message:"something went wrong in updateBooking"}
        
      }
}




}

export default UserRepository;
