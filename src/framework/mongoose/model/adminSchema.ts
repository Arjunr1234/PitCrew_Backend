import {model, Schema} from 'mongoose';


interface IAdmin{
  email:string,
  password:string
}


const adminSchema = new Schema<IAdmin>({
     email:{type:String, require:true},
     password:{type:String, require:true}
})

const adminModel = model<IAdmin>('admin', adminSchema);

export default adminModel