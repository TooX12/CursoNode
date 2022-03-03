import Employee from "../models/employee";
import config from '../config';
import jwt from 'jsonwebtoken';

var helpers = {};


helpers.tokenEmployee = async (token) => {
    if (!token) {
        res.status(401).send({ message: 'Invalid token' })
    }
    token = token.replace('Bearer ', '')
    const decoded = jwt.verify(token, config.SECRET);
    const employee = await Employee.findById(decoded.id);

    if (!employee) {
        return res.status(400).json({ messages: "Not found" });
    }
    let fullName = employee.name + " " + employee.lastName1 + " " + employee.lastName2

    return fullName;
};


module.exports = helpers;
