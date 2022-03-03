import { Router } from 'express'
import * as cursoController from '../controllers/curso.controllers'
import { authEmployeeJwt, verifyEmployee } from '../middlewares'

const router = Router();


router.get("/",  [authEmployeeJwt.verifyToken, authEmployeeJwt.isDueño], cursoController.getCurso);
router.post("/", cursoController.createCurso);
router.delete("/:CursoId", cursoController.deleteCursoById);
router.put("/:CursoId", cursoController.updateCursoById);
//cambio
//aloha
// router.get("/", [authEmployeeJwt.verifyToken, authEmployeeJwt.isDueño], employeeController.getEmployee);

// router.get("/getRol", employeeController.rol);

// router.post("/", [verifyEmployee.checkDuplicateEmployee, authEmployeeJwt.verifyToken, authEmployeeJwt.isDueño], employeeController.createEmployee);

// router.get("/:EmployeeId", [authEmployeeJwt.verifyToken, authEmployeeJwt.isDueño], employeeController.getEmployeeById);

// router.put("/:EmployeeId", [authEmployeeJwt.verifyToken, authEmployeeJwt.isDueño], employeeController.updateEmployeeById);

// router.delete("/:EmployeeId", [authEmployeeJwt.verifyToken, authEmployeeJwt.isDueño], employeeController.deleteEmployeeById);

// router.post("/changePassword", [authEmployeeJwt.verifyToken, authEmployeeJwt.isDueño], employeeController.changePassword);


export default router;
