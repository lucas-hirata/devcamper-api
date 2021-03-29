import express from 'express';
import CoursesController from '../controllers/courses';

const router = express.Router({ mergeParams: true });

router.route('/').get(CoursesController.list).post(CoursesController.add);
router.route('/:id').get(CoursesController.get);

export default router;
