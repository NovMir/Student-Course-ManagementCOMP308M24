import express from 'express';
import seedRoles  from '../controller/RoleController.js';

const router = express.Router();

router.post('/seed', seedRoles);

export default router;