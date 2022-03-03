import { Schema, model } from 'mongoose';


const tiendaSchema = new Schema({
    name: { type: String, required:true },
},{
    versionKey:false
});

export default model('tienda', tiendaSchema)