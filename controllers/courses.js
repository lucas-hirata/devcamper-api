import Course from '../models/Course';
import Bootcamp from '../models/Bootcamp';
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

    // @desc    Get single course
    // @route   GET /api/v1/courses/:id
    // @access  Public
    get = asyncHandler(async (req, res, next) => {
        const course = await Course.findById(req.params.id).populate({
            path: 'bootcamp',
            select: 'name description',
        });

        if (!course) {
            return next(
                new ErrorResponse(
                    `No course with the id of ${req.params.id}`,
                    404
                )
            );
        }

        return res.status(200).json({
            sucess: true,
            data: course,
        });
    });

    // @desc    Add course
    // @route   POST /api/v1/bootcamps/:bootcampId/courses
    // @access  Private
    add = asyncHandler(async (req, res, next) => {
        req.body.bootcamp = req.params.bootcampId;

        const bootcamp = await Bootcamp.findById(req.params.bootcampId);

        if (!bootcamp) {
            return next(
                new ErrorResponse(
                    `No bootcamp with the id of ${req.params.bootcampId}`,
                    404
                )
            );
        }

        const course = await Course.create(req.body);

        return res.status(201).json({
            sucess: true,
            data: course,
        });
    });
}

export default new CoursesController();
