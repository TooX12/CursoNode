import { Schema,model } from 'mongoose';

const rolSchema = new Schema({
    name:{type: String, required:true},
},{
    versionKey:false//Quita el __v de la coleccion
});

export default model('rol',rolSchema)