import Employee from '../models/employee';
import Rol from '../models/rol'
import jwt from 'jsonwebtoken';
import config from '../config'
import History from "../models/history";

const helpers = require('../libs/infoEmployee')
const Moment = require('moment');
const momentTz = require('moment-timezone');
export const createEmployee = async (req, res) => {
    const {
        name,
        lastName1,
        lastName2,
        email,
        password,
        rol
    } = req.body;
    const newEmployee = new Employee({
        name,
        lastName1,
        lastName2,
        email,
        password: await Employee.encryptPassword(password),
    })
    const emai = await Employee.findOne({ email: req.body.email })

    if (emai != null) {
        res.status(401).json({ messages: "Correo ya registrado" })
    }

    if (rol) {
        const foundRol = await Rol.find({ name: { $in: rol } })
        newEmployee.rol = foundRol.map(rol => rol._id)
    }

    await newEmployee.save();
    let fullName = await helpers.tokenEmployee(req.headers['x-access-token']);
    let toDay = momentTz().tz('America/Mexico_City');
    const history = new History({
        guest: fullName,
        did: "Agrego un nuevo empleado",
        dateModifi: toDay
    })
    await history.save()

    res.status(200).json({ messages: "OK" })
}

export const rol = async (req, res) => {
    const rol = await Rol.find({})
    res.status(200).json(rol)
}
export const getEmployee = async (req, res) => {
    const employees = await Employee.find({}, null, { sort: { name: 1 } }).populate('rol');
    res.status(200).json(employees);
}

export const getEmployeeById = async (req, res) => {
    const employee = await Employee.findById(req.params.EmployeeId).populate("rol");
    res.status(200).json(employee);
}

export const updateEmployeeById = async (req, res) => {
    const { rol, name, lastName1, lastName2, email } = req.body;
    const edit = { name, lastName1, lastName2, email }
    let fullName = await helpers.tokenEmployee(req.headers['x-access-token']);
    let toDay = momentTz().tz('America/Mexico_City');
    const history = new History({
        guest: fullName,
        did: "Edito datos de un empleado",
        dateModifi: toDay
    })
    await history.save()
    if (rol) {
        const foundRol = await Rol.find({ name: { $in: rol } })
        edit.rol = foundRol.map(rol => rol._id)
        const updateEmployee = await Employee.findByIdAndUpdate(req.params.EmployeeId, edit, { new: true });
        res.status(200).json(updateEmployee)
    }
}

export const deleteEmployeeById = async (req, res) => {
    let fullName = await helpers.tokenEmployee(req.headers['x-access-token']);
    let toDay = momentTz().tz('America/Mexico_City');
    const history = new History({
        guest: fullName,
        did: "Eliminio un empleado",
        dateModifi: toDay
    })
    await history.save()
    await Employee.findByIdAndDelete(req.params.EmployeeId);
    res.status(204).json();
}

export const changePassword = async (req, res) => {
    try {
        let token = req.headers['x-access-token']
        if (!token) {
            res.status(401).send({ message: 'Invalid token' })
        }

        token = token.replace('Bearer ', '')

        const decoded = jwt.verify(token, config.SECRET);
        const employee = await Employee.findById(decoded.id);

        if (!employee) {
            return res.status(400).json({ messages: "Not found" });
        }

        const matchPassword = await Employee.comparePassword(req.body.oldPassword, employee.password)
        if (!matchPassword)
            return res.status(401).json({ token: null, message: 'Invalid Password' })

        const newPassword = await Employee.encryptPassword(req.body.newPassword);
        await Employee.findByIdAndUpdate(employee._id, { password: newPassword });

        return res.status(200).json({ message: 'Ok' });
    } catch (error) {
        return res.status(400).json({ message: 'Proccess failed' });
    }
}