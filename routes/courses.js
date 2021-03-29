import express from 'express';
import CoursesController from '../controllers/courses';
import advancedResults from '../middleware/advancedResults';
import Course from '../models/Course';
import { protect, authorize } from '../middleware/auth';

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
    .post(protect, authorize('publisher', 'admin'), CoursesController.add);

router
    .route('/:id')
    .get(CoursesController.get)
    .put(protect, authorize('publisher', 'admin'), CoursesController.update)
    .delete(protect, authorize('publisher', 'admin'), CoursesController.delete);

export default router;
