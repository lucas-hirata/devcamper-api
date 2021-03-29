import express from 'express';
import CoursesController from '../controllers/courses';
import advancedResults from '../middleware/advancedResults';
import Course from '../models/Course';

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
    .post(CoursesController.add);

router
    .route('/:id')
    .get(CoursesController.get)
    .put(CoursesController.update)
    .delete(CoursesController.delete);

export default router;
