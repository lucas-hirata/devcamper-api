import Bootcamp from '../models/Bootcamp';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/asyncHandler';
import geocoder from '../utils/geocoder';
import StatusCodes from 'http-status-codes';

class BootcampsController {
    // @desc    List all bootcamps
    // @route   GET /api/v1/bootcamps
    // @access  Public
    list = asyncHandler(async (req, res, next) => {
        let requestQuery = { ...req.query };

        const paramsToRemove = ['select', 'sort', 'page', 'limit'];

        paramsToRemove.forEach((param) => delete requestQuery[param]);

        let queryString = JSON.stringify(requestQuery);
        queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

        // Finding resources
        let query = Bootcamp.find(JSON.parse(queryString)).populate('courses');

        // Selecting
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 30;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Bootcamp.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Query execution
        const bootcamps = await query;

        // Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }
        if (startIndex > 0) {
            pagination.previous = {
                page: page - 1,
                limit,
            };
        }

        return res.status(StatusCodes.OK).json({
            sucess: true,
            count: bootcamps.length,
            pagination,
            data: bootcamps,
        });
    });

    // @desc    Get single bootcamp
    // @route   GET /api/v1/bootcamps/:id
    // @access  Public
    get = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id).populate(
            'courses'
        );

        if (!bootcamp) {
            return next(
                new ErrorResponse(
                    `Bootcamp not found with id of ${req.params.id}`,
                    StatusCodes.NOT_FOUND
                )
            );
        }

        return res
            .status(StatusCodes.OK)
            .json({ sucess: true, data: bootcamp });
    });

    // @desc    Create new bootcamp
    // @route   POST /api/v1/bootcamps
    // @access  Private
    create = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.create(req.body);
        return res.status(201).json({ sucess: true, data: bootcamp });
    });

    // @desc    Update bootcamp
    // @route   PUT /api/v1/bootcamps/:id
    // @access  Private
    update = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!bootcamp) {
            return next(
                new ErrorResponse(
                    `Bootcamp not found with id of ${req.params.id}`,
                    StatusCodes.NOT_FOUND
                )
            );
        }

        return res
            .status(StatusCodes.OK)
            .json({ sucess: true, data: bootcamp });
    });

    // @desc    Delete bootcamp
    // @route   DELETE /api/v1/bootcamps/:id
    // @access  Private
    delete = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return next(
                new ErrorResponse(
                    `Bootcamp not found with id of ${req.params.id}`,
                    StatusCodes.NOT_FOUND
                )
            );
        }

        bootcamp.remove();

        return res.status(StatusCodes.OK).json({ sucess: true, data: {} });
    });

    // @desc    Get bootcamps within a radius
    // @route   GET /api/v1/bootcamps/radius/:zipcode/:radius
    // @access  Private
    getBootcampsInRadius = asyncHandler(async (req, res, next) => {
        const { zipcode, distance } = req.params;

        // Get latitude/longitude from geocoder
        const location = await geocoder.geocode(zipcode);
        const latitude = location[0].latitude;
        const longitude = location[0].longitude;

        // Calculate radius using radians
        // Divide distance by radius of Earth (6378 km)
        const radius = distance / 6378;

        const bootcamps = await Bootcamp.find({
            location: {
                $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
            },
        });

        res.status(StatusCodes.OK).json({
            sucess: true,
            count: bootcamps.length,
            data: bootcamps,
        });
    });
}

export default new BootcampsController();
