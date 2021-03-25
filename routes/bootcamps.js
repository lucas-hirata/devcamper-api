import express from 'express';
import BootcampsController from '../controllers/bootcamps';

const router = express.Router();
const bootcampsController = new BootcampsController();

router
    .route('/')
    .get(bootcampsController.list)
    .post(bootcampsController.create);

router
    .route('/:id')
    .get(bootcampsController.get)
    .put(bootcampsController.update)
    .delete(bootcampsController.delete);

export default router;
