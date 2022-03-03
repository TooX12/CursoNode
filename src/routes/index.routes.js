import { Router } from 'express';
const router = Router();

router.get("/", (req, res)=> res.json('get pagina'));

export default router;
