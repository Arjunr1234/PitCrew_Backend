import { ObjectId } from "mongoose";


export interface IAdminLoginData{
   email:string,
   password:string
}

export interface IAdminLoginResponse{
   _id:string;
   email:string,
   
}

export interface userData{
   id:string,
   name:string,
   email:string,
   phone:string,
   blocked:boolean
}

export interface IProviders{
  _id:string, 
  workshopName:string,
  ownerName:string,
  mobile:string,
  email:string
  workshopDetals:string,
  blocked:boolean,
  requestAccept:boolean,
  
}

export interface IBrands{
   _id:string,
   brand:string
}

// export interface Image {
//    id: string;
//    url: string;
//    createdAt: Date;
//  }
export interface ServiceType {
   _id:string
   category:  "general" | "road",
   serviceType: string
   imageUrl:string
   subTypes?: {_id:string,type:string}[]


}

export interface ISubServiceData{
   _id:string,
   type:string
}
 