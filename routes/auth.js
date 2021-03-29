import express from 'express';
import authController from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/me', protect, authController.getMe);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.put('/updatedetails', protect, authController.updateDetails);

export default router;
