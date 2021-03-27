import express from 'express';
import CoursesController from '../controllers/courses';

const router = express.Router();

router.route('/').get(CoursesController.list);

export default router;
