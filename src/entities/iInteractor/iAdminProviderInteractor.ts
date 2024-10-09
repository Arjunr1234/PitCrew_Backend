import { IProviders } from "../rules/admin";

export interface IAdminProviderInteractor {
  getPendingProvidersUseCase():Promise<{providers?:IProviders[], success:boolean, message?:string}>
  getProvidersUseCase():Promise<{providers?:IProviders[], success:boolean, message?:string}>
}