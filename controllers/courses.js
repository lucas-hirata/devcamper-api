import Course from '../models/Course';
import Bootcamp from '../models/Bootcamp';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/asyncHandler';
import StatusCodes from 'http-status-codes';

class CoursesController {
    // @desc    List all courses
    // @route   GET /api/v1/courses
    // @route   GET /api/v1/bootcamps/:bootcampId/courses
    // @access  Public
    list = asyncHandler(async (req, res, next) => {
        if (req.params.bootcampId) {
            const courses = await Course.find({
                bootcamp: req.params.bootcampId,
            });

            return res.status(StatusCodes.OK).json({
                sucess: true,
                count: courses.length,
                data: courses,
            });
        } else {
            return res.status(StatusCodes.OK).json(res.advancedResults);
        }
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
                    StatusCodes.NOT_FOUND
                )
            );
        }

        return res.status(StatusCodes.OK).json({
            sucess: true,
            data: course,
        });
    });

    // @desc    Add course
    // @route   POST /api/v1/bootcamps/:bootcampId/courses
    // @access  Private
    add = asyncHandler(async (req, res, next) => {
        req.body.bootcamp = req.params.bootcampId;
        req.body.user = req.user.id;

        const bootcamp = await Bootcamp.findById(req.params.bootcampId);

        if (!bootcamp) {
            return next(
                new ErrorResponse(
                    `No bootcamp with the id of ${req.params.bootcampId}`,
                    StatusCodes.NOT_FOUND
                )
            );
        }

        // Make sure user is bootcamp owner
        if (
            bootcamp.user.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to add a course to this bootcamp`,
                    StatusCodes.UNAUTHORIZED
                )
            );
        }

        const course = await Course.create(req.body);

        return res.status(201).json({
            sucess: true,
            data: course,
        });
    });

    // @desc    Update course
    // @route   PUT /api/v1/courses/:id
    // @access  Private
    update = asyncHandler(async (req, res, next) => {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return next(
                new ErrorResponse(
                    `No course with the id of ${req.params.id}`,
                    StatusCodes.NOT_FOUND
                )
            );
        }

        // Make sure user is course owner
        if (
            course.user.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to update this course`,
                    StatusCodes.UNAUTHORIZED
                )
            );
        }

        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        return res.status(StatusCodes.OK).json({
            sucess: true,
            data: course,
        });
    });

    // @desc    Delete course
    // @route   PUT /api/v1/courses/:id
    // @access  Private
    delete = asyncHandler(async (req, res, next) => {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return next(
                new ErrorResponse(
                    `No course with the id of ${req.params.id}`,
                    StatusCodes.NOT_FOUND
                )
            );
        }

        // Make sure user is course owner
        if (
            course.user.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to update this course`,
                    StatusCodes.UNAUTHORIZED
                )
            );
        }

        await course.remove();

        return res.status(StatusCodes.OK).json({
            sucess: true,
            data: {},
        });
    });
}

export default new CoursesController();
