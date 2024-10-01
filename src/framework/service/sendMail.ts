import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Mailer } from '../../entities/services/iMailer';

dotenv.config();

const sendMail = async (email: string, content: string): Promise<{ success: boolean }> => {
  try {
    
    console.log("Sending email to:", email);
    console.log("Email content:", content);

    console.log("This is Mailer.email to:", process.env.MAILER_USER);
    
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
      },
    });


    const mailOptions = {
      from: process.env.MAILER_USER,  // Should match the 'user' in auth
      to: email,
      subject:  'Your OTP Code' ,
      text: content,
    };
    
    // Debugging: log mailOptions to check if 'to' is defined
     console.log("Mail options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false };
  }
};

export default sendMail;
