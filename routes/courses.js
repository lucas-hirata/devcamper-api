import express from 'express';
import CoursesController from '../controllers/courses';
import advancedResults from '../middleware/advancedResults';
import Course from '../models/Course';
import { protect } from '../middleware/auth';

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(
        advancedResults(Course, {
            path: 'bootcamp',
            select: 'name description',
        }),
        CoursesController.list
    )
    .post(protect, CoursesController.add);

router
    .route('/:id')
    .get(CoursesController.get)
    .put(protect, CoursesController.update)
    .delete(protect, CoursesController.delete);

export default router;
