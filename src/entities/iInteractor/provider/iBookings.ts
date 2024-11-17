import { IAddSlotData, ISlotDataUseCase } from "../../rules/provider";



export interface IProviderBookingsInteractor{

  addSlotUseCase(data:IAddSlotData):Promise<{success:boolean, message?:string, slotData?:ISlotDataUseCase[]}>
  getAllSlotUseCase(providerId:string):Promise<{success:boolean, message?:string, slotData?:ISlotDataUseCase[]}>
  updateSlotCountUseCase(slotId:string, state:number):Promise<{success:boolean, message?:string}>
  removeSlotUseCase(slotId:string):Promise<{success:boolean, message?:string}>

}


