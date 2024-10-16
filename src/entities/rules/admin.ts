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

// export interface Image {
//    id: string;
//    url: string;
//    createdAt: Date;
//  }
 