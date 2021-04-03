import express from 'express';
import authController from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/me', protect, authController.getMe);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotpassword', authController.forgotPassword);
router.put('/resetpassword/:resettoken', authController.resetPassword);
router.put('/updatedetails', protect, authController.updateDetails);
router.put('/updatepassword', protect, authController.updatePassword);

export default router;
