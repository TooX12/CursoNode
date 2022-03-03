import { Router } from 'express';
const router = Router();

import * as authEmployeeController from '../controllers/authEmployee.controller'

router.post('/signinEmployee',authEmployeeController.signIn)
//Nota Este se debe cambiar para utilizar el registro de clientes
router.post('/signupEmployee',authEmployeeController.signUp)
router.post('/requestPasswordEmail', authEmployeeController.requestPasswordEmail)
router.get('/verifyMailToken/:token', authEmployeeController.verifyMailToken)
router.put('/restorePassword/:token', authEmployeeController.restorePassword)
router.get('/verifyAuthToken', authEmployeeController.verifyAuthToken)

export default router;
