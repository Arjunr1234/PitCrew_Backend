export interface user{
  name: string,
  phone: string,
  email: string,
  password: string
}

export interface userResponseData{
  id:string,
  name:string,
  email:string,
  mobile:string,
  blocked:boolean
}

export interface userSignIn{
    email:string,
    password:string
}



