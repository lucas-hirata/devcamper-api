import express from 'express';
import usersController from '../controllers/users';
import advancedResults from '../middleware/advancedResults';
import User from '../models/User';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(advancedResults(User), usersController.list)
    .post(usersController.insert);

router
    .route('/:id')
    .get(usersController.get)
    .put(usersController.update)
    .delete(usersController.delete);

export default router;
