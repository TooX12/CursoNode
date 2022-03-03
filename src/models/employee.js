import { Schema,model } from 'mongoose';
import bcrypt  from 'bcryptjs'

const employeeSchema = new Schema({
    name:{type: String, required:true},
    lastName1:{type: String, required:true},
    lastName2:{type: String, required:true},
    email:{type: String, unique:true,required:true},
    password:{type: String, required:true},
    rol:[{
        ref:"rol",
        type:Schema.Types.ObjectId
    }]
    //date:{type:Date,default: Date.now}
},{
    timestamps: true,//Sirve para ver las fechas
    versionKey:false//Quita el __v de la coleccion
    }
);

employeeSchema.statics.encryptPassword = async (password)=>{
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password,salt)
}

employeeSchema.statics.comparePassword = async (password, receivedPassword)=>{
    return await bcrypt.compare(password,receivedPassword)
}

export default model('employee',employeeSchema)