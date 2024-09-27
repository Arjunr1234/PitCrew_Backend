

interface Imailer{
  sendMail(email:string):Promise<{otp:string,success:boolean}>
}

interface mailConfig{
  user:string,
  pass:string
}

export const Mailer = <mailConfig>{
  user:process.env.MAILER_USER,
  pass : process.env.MAILER_PASS
} 

export default Imailer