import Imailer from "../../entities/services/iMailer";
import generateRandomOTP from "./generateOtp";
import sendMail from "./sendMail";

class Mailer implements Imailer{


  async sendMail(email: string): Promise<{ otp: string; success: boolean; }> {
    const otp: string = generateRandomOTP()
    console.log("This is the otp from Mailer: ", otp)
   const response =  await sendMail(email, otp) 
   return {otp:otp,success:response.success}
}

  async sendRejectonMail(email: string, reason: string): Promise<{ success: boolean; message?: string; }> {
        try {
            const response = await sendMail(email, reason, "RejectionMail");
            if(!response.success){
               return {success:false, message:"Failed to send rejection mail"}
            }

            return{success:true, message:"Successfully sended the mail"}
          
        } catch (error) {
            console.log("Error in sendRejction Mail: ", error)
            return {success:false, message:'Something went wrong in sendRejectionMail'}
        }
  }



}

export default Mailer