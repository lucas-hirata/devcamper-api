import Review from '../models/Review';
import Bootcamp from '../models/Bootcamp';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/asyncHandler';
import StatusCodes from 'http-status-codes';

class ReviewController {
    // @desc    List all reviews
    // @route   GET /api/v1/reviews
    // @route   GET /api/v1/bootcamps/:bootcampId/reviews
    // @access  Public
    list = asyncHandler(async (req, res, next) => {
        if (req.params.bootcampId) {
            const reviews = await Review.find({
                bootcamp: req.params.bootcampId,
            });

            return res.status(StatusCodes.OK).json({
                sucess: true,
                count: reviews.length,
                data: reviews,
            });
        } else {
            return res.status(StatusCodes.OK).json(res.advancedResults);
        }
    });
}

export default new ReviewController();
