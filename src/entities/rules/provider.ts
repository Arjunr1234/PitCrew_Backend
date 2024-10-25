import { Types } from "mongoose"

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
  
}
export interface SupportedBrand {
  brandId: string;
  brandName: string;
}

export interface IworkshopDetails {
  address: string,
  coordinates: {
    lattitude: number, 
    longitude: number
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
  type: string;
  startingPrice: number;
}

// passing road service data and general data from the interactor

export interface IProviderGeneralServiceData{
  typeid:string
  typename:string
  image:string
  category:"general"|"road"
  isAdded:boolean
  subType?:providerServicesSubtype[] 
}

interface providerServicesSubtype{
  _id:string
  type:string
  isAdded:boolean
  priceRange?:number
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
  subtype: Subtype[]; 
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