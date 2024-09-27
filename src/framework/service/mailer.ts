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

}

export default Mailer