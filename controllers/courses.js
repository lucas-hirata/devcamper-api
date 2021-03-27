import Course from '../models/Course';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/asyncHandler';

class CoursesController {
    // @desc    List all courses
    // @route   GET /api/v1/courses
    // @route   GET /api/v1/bootcamps/:bootcampId/courses
    // @access  Public
    list = asyncHandler(async (req, res, next) => {
        let query;

        if (req.params.bootcampId) {
            query = Course.find({ bootcamp: req.params.bootcampId });
        } else {
            query = Course.find().populate({
                path: 'bootcamp',
                select: 'name description',
            });
        }

        const courses = await query;

        return res.status(200).json({
            sucess: true,
            count: courses.length,
            data: courses,
        });
    });
}

export default new CoursesController();
