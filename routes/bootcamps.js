import express from 'express';
import BootcampsController from '../controllers/bootcamps';
import advancedResults from '../middleware/advancedResults';
import Bootcamp from '../models/Bootcamp';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), BootcampsController.list)
    .post(protect, authorize('publisher', 'admin'), BootcampsController.create);

router
    .route('/:id')
    .get(BootcampsController.get)
    .put(protect, authorize('publisher', 'admin'), BootcampsController.update)
    .delete(
        protect,
        authorize('publisher', 'admin'),
        BootcampsController.delete
    );

router
    .route('/:id/photos')
    .put(
        protect,
        authorize('publisher', 'admin'),
        BootcampsController.uploadPhoto
    );

router
    .route('/radius/:zipcode/:distance')
    .get(BootcampsController.getBootcampsInRadius);

// Including other resource routers
import courseRouter from './courses';
router.use('/:bootcampId/courses', courseRouter);

export default router;
