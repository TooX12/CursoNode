import express from 'express'
import morgan from "morgan"

const path = require('path');
const cors = require('cors');

import { createRol } from './libs/inicialSetup'

import indexRoutes from './routes/index.routes'
import authEmployeeRoutes from './routes/authEmployee.routes'
import employeeRoutes from './routes/employee.routes'
import tiendaRoutes from './routes/tienda.routes'
import cursoRoutes from './routes/curso.routes'

const app = express()
createRol()
require('dotenv').config()//Necesario para obtener las variables globales

app.use(cors(
    // {
    // methods: ['GET','POST','DELETE','UPDATE','PUT']
    // }
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

//Routes

app.use('/api/index', indexRoutes);//Pagina
app.use('/api/authEmployee', authEmployeeRoutes);//Authentication
app.use('/api/employee', employeeRoutes);//Authentication
app.use('/api/tienda', tiendaRoutes);//Authentication
app.use('/api/curso', cursoRoutes);//Authentication

export default app;