import jwt from "jsonwebtoken";
import config from "../config";
import Employee from "../models/employee";
import Rol from "../models/rol";

export const verifyToken = async (req, res, next) => {


    try {
        let token = req.headers["x-access-token"]
        token = token.replace('Bearer ', '')

        if (!token) return res.status(403).json({ message: "No teken provided" })

        const decoded = jwt.verify(token, config.SECRET)
        req.employeeId = decoded.id;

        const employee = await Employee.findById(req.employeeId, { password: 0 })
        if (!employee) return res.status(404).json({ message: "No employee found" });
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}

export const isDueño = async (req, res, next) => {

    const employee = await Employee.findById(req.employeeId)
    const rol = await Rol.find({ _id: { $in: employee.rol } })

    for (let i = 0; i < rol.length; i++) {
        if (rol[i].name === "Dueño") {
            next()
            return;
        }
    }
    return res.status(403).json({ message: "Requiere ser Dueño" })
}

export const isVenta = async (req, res, next) => {

    const employee = await Employee.findById(req.employeeId)
    const rol = await Rol.find({ _id: { $in: employee.rol } })

    for (let i = 0; i < rol.length; i++) {
        if (rol[i].name === "Ventas" || rol[i].name === "Dueño") {
            next()
            return;
        }
    }
    return res.status(403).json({ message: "Requiere ser Ventas" })
}


export const isRecepcion = async (req, res, next) => {

    const employee = await Employee.findById(req.employeeId)
    const rol = await Rol.find({ _id: { $in: employee.rol } })

    for (let i = 0; i < rol.length; i++) {
        if (rol[i].name === "Recepción") {
            next()
            return;
        }
    }
    return res.status(403).json({ message: "Requiere ser Recepcion" })
}