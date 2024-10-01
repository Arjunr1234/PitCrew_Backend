

interface IproviderRepository{
      providerExist(email:string):Promise<{success:boolean, message?:string}>
      saveOtp(otp:string, email:string):Promise<{success:boolean; message?:string}>

}

export default IproviderRepository