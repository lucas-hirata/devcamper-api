import express from 'express';
import BootcampsController from '../controllers/bootcamps';
import advancedResults from '../middleware/advancedResults';
import Bootcamp from '../models/Bootcamp';

const router = express.Router();

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), BootcampsController.list)
    .post(BootcampsController.create);

router
    .route('/:id')
    .get(BootcampsController.get)
    .put(BootcampsController.update)
    .delete(BootcampsController.delete);

router.route('/:id/photos').put(BootcampsController.uploadPhoto);

router
    .route('/radius/:zipcode/:distance')
    .get(BootcampsController.getBootcampsInRadius);

// Including other resource routers
import courseRouter from './courses';
router.use('/:bootcampId/courses', courseRouter);

export default router;
