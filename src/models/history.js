import { Schema, model } from 'mongoose';


const historySchema = new Schema({
    guest: { type: String },
    did: { type: String },
    dateModifi: { type: Date }
}, {
    timestamps: true,//Sirve para ver las fechas
    versionKey: false//Quita el __v de la coleccion
});

export default model('history', historySchema)