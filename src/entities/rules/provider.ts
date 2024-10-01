


export interface ProviderModel {
  workshopName: string,
  ownerName: string,
  email: string,
  mobile: string,
  password: string
  workshopDetails: workshopDetails,
  blocked: boolean,
  requestAccept: boolean
}

interface   workshopDetails{
     address:string,
     location:{
       lattitude:string,
       longitude:string
     }
}