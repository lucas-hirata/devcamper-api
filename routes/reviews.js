import express from 'express';
import ReviewController from '../controllers/reviews';
import advancedResults from '../middleware/advancedResults';
import Review from '../models/Review';
import { protect, authorize } from '../middleware/auth';

const router = express.Router({ mergeParams: true });

router.route('/').get(
    advancedResults(Review, {
        path: 'bootcamp',
        select: 'name description',
    }),
    ReviewController.list
);
/*.post(protect, authorize('publisher', 'admin'), ReviewController.add);

router
    .route('/:id')
    .get(ReviewController.get)
    .put(protect, authorize('publisher', 'admin'), ReviewController.update)
    .delete(protect, authorize('publisher', 'admin'), ReviewController.delete);*/

export default router;
