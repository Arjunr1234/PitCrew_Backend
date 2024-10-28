import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Mailer } from '../../entities/services/iMailer';
import { otpTemplate, providerRejectionTemplate } from './emailTemplate';

dotenv.config();

const sendMail = async (email: string, content: string,subject?:string): Promise<{ success: boolean }> => {
  try {
    

       
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
      },
    });


    const mailOptions = {
      from: process.env.MAILER_USER,  
      to: email,
      subject:subject?subject:  'PitCrew' ,
      html: subject?providerRejectionTemplate(content):otpTemplate(content),
      
    };

    
    
     console.log("Mail options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log('Email info.response :', info.response);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false };
  }
};

export default sendMail;
