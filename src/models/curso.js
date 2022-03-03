import { Schema, model } from 'mongoose';


const cursoSchema = new Schema({
    profesor: { type: String, required:true },
    status: { type: String, required:true },
    materia: { type: String, required:true },
},{
    versionKey:false
});

export default model('curso', cursoSchema)