import { IAddBrandData, IAddingData, IAddSlotData, IAdminBrand, IEditSubType, IGetSlotData, ILogData, IProfileEdit, IProviderBrand, IProviderData,IProviderRegisterData,IProviderResponseData, IRemoveBrandData, IRemoveService, IRemoveSubTypeData, ISlotData, ISubTypeData, IWorkshopData, IworkshopDetails, ProviderModel } from "../rules/provider";
import { Types } from "mongoose";

interface IproviderRepository{
      providerExist(email:string):Promise<{success:boolean, message?:string}>
      saveOtp(otp:string, email:string):Promise<{success:boolean; message?:string}>
      getOtp(email:string, otp:string):Promise<{success:boolean, otp?:string|undefined}>
      createProvider(providerData:IProviderRegisterData):Promise<{success:boolean, message?:string}>
      loginRepo(loginData:ILogData):Promise<{success:boolean, message?:string, provider?:IProviderResponseData}>
      getAllProviderService(id:string, vehicleType:number):Promise<{success:boolean, message?:string, providerService?:IProviderServices|null,allServices?:IAllServices[]}>
      addGeneralOrRoadService(data:IAddingData):Promise<{success:boolean, message?:string}>
      getAllBrandsRepo(providerId:string):Promise<{success:boolean, message?:string, adminBrand?:IAdminBrand[] , providerBrand?:IProviderBrand[] | []}>
      addBrandRepo(brandData:IAddBrandData):Promise<{success:boolean, message?:string,}>
      removeBrandRepo(brandData:IRemoveBrandData):Promise<{success:boolean, message?:string}>
      addSubTypeRepo(data:ISubTypeData):Promise<{success:boolean, message?:string}>
      removeSubTypeRepo(data:IRemoveSubTypeData):Promise<{success:boolean, message?:string}>
      editSubTypeRepo(data:IEditSubType):Promise<{success:boolean, meessage?:string}>
      removeServiceRepo(data:IRemoveService):Promise<{success:boolean, message?:string}>
      addSlotRepo(data:IAddSlotData):Promise<{success:boolean, message?:string, slotData?:ISlotData[]}>
      getAllSlotRepo(providerId:string):Promise<{success:boolean, message?:string, slotData?:IGetSlotData[]}>
      updateSlotCountRepo(slotId:string, state:number):Promise<{success:boolean, message?:string}>
      removeSlotRepo(slotId:string):Promise<{success:boolean, message?:string}>
      getProviderDetailsRepo(providerId:string):Promise<{success:boolean, message?:string, providerData?:any}>//IworkshopData (the above)
      editProfileRepo(data:IProfileEdit):Promise<{success:boolean, message?:string}>
      updateProfileImageRepo(providerId:string, imageUrl:string):Promise<{success:boolean, message?:string, prevImgUrl?:string | null, newImgUrl?:string}>
      getAllBookingRepo(providerId:string):Promise<{success:boolean, message?:string, bookingData?:any}>
      changeBookingStatusRepo(bookingId:string, status:string):Promise<{success:boolean, message?:string}>
      resetPasswordRepo(providerId:string, currentPassword:string, newPassword:string):Promise<{success:boolean, message?:string}>
      getSingleBookingRepo(bookingId:string):Promise<{success:boolean, message?:string, bookingData?:any}>
}











export default IproviderRepository






export interface IAllServices {
      _id:string
      category:  "general" | "road",
      serviceType: string
      imageUrl:string
      subTypes?: {_id:string,type:string}[]
 }

export interface IProviderServices {
      workshopId:Types.ObjectId,
      twoWheeler?:Service[],
      fourWheeler?:Service[]
    }

    interface Service {
      typeId: string;    
      category: string;
      subtype: Array<{
        type: string;
        startingPrice: number;
      }>;
    }

export interface IServices{
     id:string,
     category:string,
     serviceType:string,
     imageUrl:string
     subTypes:string[]
}

export interface IBrandData {
      id:string,
      brand:string
}