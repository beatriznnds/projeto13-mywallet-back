import { getUser, createUser } from '../controllers/authController.js';
import { Router } from 'express';

const router = Router();

router.post('/login', getUser);
router.post('/signup', createUser);

export default router;