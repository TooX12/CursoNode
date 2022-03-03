import { Router } from 'express'
import * as employeeController from '../controllers/employee.controllers'
import { authEmployeeJwt, verifyEmployee } from '../middlewares'

const router = Router();


router.get("/", [authEmployeeJwt.verifyToken, authEmployeeJwt.isDueño], employeeController.getEmployee);

router.get("/getRol", employeeController.rol);

router.post("/", [verifyEmployee.checkDuplicateEmployee, authEmployeeJwt.verifyToken, authEmployeeJwt.isDueño], employeeController.createEmployee);

router.get("/:EmployeeId", [authEmployeeJwt.verifyToken, authEmployeeJwt.isDueño], employeeController.getEmployeeById);

router.put("/:EmployeeId", [authEmployeeJwt.verifyToken, authEmployeeJwt.isDueño], employeeController.updateEmployeeById);

router.delete("/:EmployeeId", [authEmployeeJwt.verifyToken, authEmployeeJwt.isDueño], employeeController.deleteEmployeeById);

router.post("/changePassword", [authEmployeeJwt.verifyToken, authEmployeeJwt.isDueño], employeeController.changePassword);


export default router;
