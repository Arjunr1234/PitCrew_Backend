export interface ProviderModel {
  workshopName: string,
  ownerName: string,
  email: string,
  mobile: string,
  password: string,
  workshopDetails: IworkshopDetails, 
  blocked: boolean,
  requestAccept: boolean
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
