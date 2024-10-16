
interface IAdminServiceInteractor{
  addServiceUseCase(file: Buffer, data:IData): Promise<{success:boolean, message?:string}>;


}

export interface IData{
    category:string,
    serviceType:string
}


export default IAdminServiceInteractor