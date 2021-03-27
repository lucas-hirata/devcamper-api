import express from 'express';
import BootcampsController from '../controllers/bootcamps';

const router = express.Router();

router
    .route('/')
    .get(BootcampsController.list)
    .post(BootcampsController.create);

router
    .route('/:id')
    .get(BootcampsController.get)
    .put(BootcampsController.update)
    .delete(BootcampsController.delete);

router
    .route('/radius/:zipcode/:distance')
    .get(BootcampsController.getBootcampsInRadius);

// Including other resource routers
import courseRouter from './courses';
router.use('/:bootcampId/courses', courseRouter);

export default router;
