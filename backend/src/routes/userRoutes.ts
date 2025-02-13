import express from 'express';
import { getUserRanking } from '../controllers/dashboardController';
import { registerUser, loginUser, getUsers , deleteUser } from '../controllers/userController';

const router = express.Router();

router.get('/ranking', getUserRanking)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.delete('/:id', deleteUser);

export default router;
