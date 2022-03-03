import Employee from '../models/employee';
import Rol from '../models/rol'
import jwt from 'jsonwebtoken';
import config from '../config'

const helpers = require('../libs/infoEmployee')
const nodemailer = require('nodemailer');

export const signUp = async (req, res) => {
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

    if (rol) {
        const foundRol = await Rol.find({ name: { $in: rol } })
        newEmployee.rol = foundRol.map(rol => rol._id)
    }

    const saveEmployee = await newEmployee.save();

    const token = jwt.sign({ id: saveEmployee._id }, config.SECRET, {
        //expiresIn:86400//24 horas para que expire el token
        expiresIn: 18000//5 horas para que expire el token
    })

    res.status(200).json({ token })
}

export const signIn = async (req, res) => {
    const employeeFound = await Employee.findOne({ email: req.body.email }).populate("rol")
    if (!employeeFound) {
        return res.status(400).json({ messages: "user not fount" })
    }

    const matchPassword = await Employee.comparePassword(req.body.password, employeeFound.password)

    if (!matchPassword) return res.status(401).json({ token: null, message: 'Invalid Password' })

    const token = jwt.sign({ id: employeeFound._id }, config.SECRET, {
        expiresIn: 18000
    })
    let rol = employeeFound.rol[0].name
    res.json({ token, rol })
}

export const requestPasswordEmail = async (req, res) => {
    try {
        const employee = await Employee.findOne({ email: req.body.email }).populate("rol");

        if (employee) {
            const token = jwt.sign(
                { id: employee._id },
                config.SECRET,
                { expiresIn: 60 * 15 }
            )

            let emailContent = `
                <h2>HOTEL CASA MADERO</h2>
                <h4>Estimado, ${employee.name}</h4>
                <h5>Has solicitado un correo para recuperar tu acceso al sistema.</h5>
                <h5>Utiliza el siguiente enlace para continuar con la recuperación de tu cuenta</h5>
                <a href='${process.env.FRONT_END}/login/reset-password/${token}'>Link de recuperación</a><br>
                <h5>Si el hipervínculo no funciona, pega el siguiente enlace en tu navegador</h5>
                <h5>${process.env.FRONT_END}/login/reset-password/${token}</h5>
                <h7>Hecho por SoftwareMX®</h7>
            `;
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "softwaremx.developers@gmail.com",
                    pass: "imylfqzmqyhcewhj", //imylfqzmqyhcewhj //eyiuhnlmabmrtlhf
                },
            });

            let info = await transporter.sendMail({
                from: '"SoftwareMX 👻" <softwaremx.developers@gmail.com>', // sender address
                to: employee.email, // list of receivers
                subject: "Recuperación de contraseña ✔", // Subject line
                html: emailContent // html body
            });
        }

        return res.status(200).json({ message: 'Ok' });
    } catch (error) {
        return res.status(400).json({ message: 'Proccess failed' })
    }
}

export const verifyMailToken = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, config.SECRET);
        const employee = await Employee.findById(decoded.id);

        if (!employee) {
            return res.status(400).json({ messages: "Not found" });
        }
        return res.status(200).json({ message: 'Ok' });
    } catch (error) {
        return res.status(400).json({ message: 'Proccess failed' });
    }
}

export const restorePassword = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, config.SECRET);
        const employee = await Employee.findById(decoded.id);

        if (!employee) {
            return res.status(400).json({ messages: "Not found" });
        }
        const newPassword = await Employee.encryptPassword(req.body.newPassword);
        await Employee.findByIdAndUpdate(employee._id, { password: newPassword });

        return res.status(200).json({ message: 'Ok' });
    } catch (error) {
        return res.status(400).json({ message: 'Proccess failed' });
    }
}

export const verifyAuthToken = async (req, res) => {
    try {
        let token = req.headers['x-access-token']
        if (!token) {
            res.status(401).send({ message: 'Invalid token' })
        }

        token = token.replace('Bearer ', '')

        const decoded = jwt.verify(token, config.SECRET);
        const employee = await Employee.findById(decoded.id).populate("rol");
        let rol = employee.rol[0].name

        if (!employee) {
            console.log("No empleado")
            return res.status(400).json({ messages: "Not found" });
        }

        token = jwt.sign(
            { id: employee._id },
            config.SECRET,
            { expiresIn: 86400 }
        )
        return res.status(200).json({ message: 'Ok', token: token, rol });
    } catch (error) {
        return res.status(400).json({ message: 'Proccess failed' });
    }
}
