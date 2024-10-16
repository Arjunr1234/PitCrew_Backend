import { IProviders } from "../rules/admin";

export interface IAdminProviderInteractor {
  getPendingProvidersUseCase():Promise<{providers?:IProviders[], success:boolean, message?:string}>
  getProvidersUseCase():Promise<{providers?:IProviders[], success:boolean, message?:string}>
  providerAcceptAndReject(id:string, state:boolean):Promise<{success:boolean, message?:string}>
  providerBlockAndUnblockUseCase(id:string, state:boolean):Promise<{success:boolean, message?:string}>
}