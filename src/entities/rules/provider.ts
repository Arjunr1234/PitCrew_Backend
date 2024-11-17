import { Schema, Types } from "mongoose"

export interface ProviderModel {
  workshopName: string,
  ownerName: string,
  email: string,
  mobile: string,
  password: string,
  supportedBrands: SupportedBrand[],
  workshopDetails: IworkshopDetails, 
  blocked: boolean,
  requestAccept: boolean,
  logoUrl:string,
  about:string
  
}
export interface SupportedBrand {
  brandId: string;
  brandName: string;
}

export interface IworkshopDetails {
  address: string,
  location: {
    type:"Point" ;
    coordinates: [number, number];
  }
}


export interface IProviderData {
  workshopName: string,
  ownerName: string,
  mobile: string,
  email: string,
  password: string,
  workshopDetails: IworkshopDetails
}

// This is the interface for IProviderRegistration Data

export interface IProviderRegisterData{
  workshopName: string;
  ownerName: string;
  mobile: string;
  email: string;
  password: string;
  workshopDetails: {
    address: string;
    coordinates: {
      lat: number;
      long: number;
    };
  };
}


export interface ILogData {
  email: string,
  password: string
}


export interface IProviderResponseData {
  _id: string,
  workshopName: string,
  ownerName: string,
  mobile: string,
  email: string,
  workshopDetails: IworkshopDetails,
  blocked: boolean,
  requestAccept: boolean
}

export interface IServiceSchema{
    category: "general" | "road",
    serviceType: string,
    imageUrl:string,
    subTypes:{_id:string,type:string}[]
    isActive:boolean
}

export interface IsubTypeSchemaModel {
  type:string
}



export interface services {
  typeId: Types.ObjectId; 
  category: 'road' | 'general'; 
  subtype: subtype[]; 
}

export  interface IProviderServiceSchema{
  workshopId:Types.ObjectId;
  twoWheeler:services[]
  fourWheeler:services[]
}

export interface subtype {
  type:Schema.Types.ObjectId;
  startingPrice: number;
}

// passing road service data and general data from the interactor

export interface IProviderGeneralServiceData{
  typeid:string
  typename:string
  image:string
  category:"general"|"road"
  isAdded:boolean
  subType?:providerServicesSubtype[] |[]
}

interface providerServicesSubtype{
  _id:string
  type:string
  isAdded:boolean|undefined
  priceRange?:number | undefined
}

export interface IProviderRoadServiceData{
  typeid:string
  typename:string
  image:string
  category:"general"|"road"
  isAdded:boolean
}

//getAllservice from interactor

interface Subtype {
  type: string; 
  startingPrice: number;
  
}


export interface Services {
  typeId: string; 
  category: string; 
  subType?: Subtype[]; 
}

export interface IAddingData{
  providerId:string,
  typeId:string,
  category:string,
  vehicleType:string
}

/// get-all brand-repo

export interface IProviderBrand{
  brandId:string,
  brandName:string
}


export interface IAdminBrand{
      id:string,
      brand:string
}

//get all brand - useCase

export interface IBrand{
      brandId:string,
      brandName:string,
      isAdded:boolean
}

// add-brands repo

export interface IAddBrandData {
  providerId:string
  brandId:string, 
  brandName:string
}

// removeBrand repo

export interface IRemoveBrandData{
  brandId:string,
  providerId:string
}

//addsubType repo

interface subType{
  type:string,
  startingPrice:number,
  vehicleType:string
}


export interface ISubTypeData{
  providerId:string,
  serviceId:string,
  newSubType:subType
}

/// remove subType Repo

export interface IRemoveSubTypeData{
  providerId: string,
  serviceId:string,
  type:string,
  vehicleType:string
}

// edit subType

export interface IEditSubType{
  providerId:string,
  serviceId:string,
  subType:{type:string,startingPrice:number, vehicleType:string}
}

// remove Service

export interface IRemoveService{
  providerId:string,
  serviceId:string,
  vehicleType:string
}

//this is the interface of Vehicle fullDetals 

interface VehicleBrand {
  brandName: string;
  id: string;
}

interface Location {
  place_name: string;
  coordinates: [number, number];
}

export interface IFullDetails {
  serviceId: string;
  vehicleNumber: string;
  vehicleBrand: VehicleBrand;
  vehicleModel: string;
  kilometers: number;
  vehicleType: string;
  fuelType: string;
  location: Location;
}

// Add slot Data -repo

export interface IAddSlotData{
  providerId:string, 
  startingDate :Date,
  endingDate :Date | null;
  count:number
}
export interface ISlotData{
_id:string,
date:Date,
count:number
}

// Add slotData - useCase

export interface IAddSlotData{
  providerId:string,
  startingDate:Date,
  endingDate:Date  | null,
  count:number
}
export interface ISlotDataUseCase{
  _id:string,
  date:Date,
  count:number
  }

  // get all slot data

 export interface IGetSlotData{
    _id:string,
    date:Date,
    count:number
  }


  // bookingservicePaymentUsecase:

//  export interface IBookingData {
//     vehicleDetails: VehicleDetails;
//     providerId: string;
//     userId: string;
//     userPhone: string;
//     slotId: string;
//     totalPrice: number;
//   }
  
//   interface VehicleDetails {
//     serviceId: string;
//     serviceName: string;
//     vehicleNumber: string;
//     vehicleBrand: VehicleBrand;
//     vehicleModel: string;
//     kilometers: number;
//     vehicleType: "twoWheeler" | "fourWheeler";
//     fuelType: "Petrol" | "Diesel" 
//     location: Location;
//   }
  
//   interface VehicleBrand {
//     brandName: string;
//     id: string;
//   }
  
//   interface Location {
//     place_name: string;
//     coordinates: [number, number];
//   }
interface Location {
  place_name: string;
  coordinates: [number, number]; // Latitude and Longitude
}

interface VehicleBrand {
  brandName: string;
  id: string;
}

interface VehicleDetails {
  serviceId: string;
  serviceName: string;
  vehicleNumber: string;
  vehicleBrand: VehicleBrand;
  vehicleModel: string;
  kilometers: number;
  vehicleType: 'twoWheeler' | 'fourWheeler';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
  location: Location;
}

interface SelectedService {
  type: string;
  startingPrice: string;
  _id: string;
  isAdded: boolean;
}

export interface IBookingData {
  vehicleDetails: VehicleDetails;
  providerId: string;
  userId: string;
  selectedServices: SelectedService[];
  userPhone: string;
  slotId: string;
  totalPrice: number;
  platformFee:number
}

  
