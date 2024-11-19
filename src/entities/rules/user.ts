import { ObjectId } from "mongoose"

export interface user{
  name: string,
  phone: string,
  email: string,
  password: string
}

export interface userResponseData{
  id:string,
  name:string,
  email:string,
  mobile:string,
  blocked:boolean
}

export interface userSignIn{
    email:string,
    password:string
}

// get all service data

export interface IServiceData{
  id:string,
  category:string,
  serviceType:string,
  imageUrl:string,
  isActive:boolean
}

// get all Brand Data

export interface IBrandData{
  brandName:string,
  id:string
}

//This is the interface of Full details

interface VehicleBrand {
  brandName: string;
  id: string;
}

interface Location {
  place_name: string;
  coordinates: [number, number];
}

export interface IDetails {
  serviceId: string | ObjectId;
  vehicleNumber: string;
  vehicleBrand: VehicleBrand;
  vehicleModel: string;
  kilometers: number;
  vehicleType: string;
  fuelType: string;
  location: Location;
}

export interface IProvidersData{
  id:string,
  workshopName:string,
  ownerName:string,
  email:string,
  mobile:string,
  address:string,
  coordinates:[number, number]
}


// fetchMatching providers usecase

export interface IProvidersUseData{
  id:string,
  workshopName:string,
  ownerName:string,
  email:string,
  mobile:string,
  address:string,
  distance:number,
  coordinates:[number, number]

}

// getuserDetails for repo and usecase

export interface IUserData {
  _id: string;
  name: string;
  phone: string;
  email: string;
  imageUrl: string;
}


// profileData Edit Repo and usecase

export interface IProfileData{
  userId:string,
  phone:string,
  name:string
}

