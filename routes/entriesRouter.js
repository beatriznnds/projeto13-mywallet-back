import { getEntries, makeEntry} from '../controllers/entriesController.js';
import validateUser from '../middlewares/validateUser.js';
import { Router } from 'express';

const router = Router();

router.get('/entries', validateUser, getEntries);
router.post('/entries', makeEntry)

export default router;