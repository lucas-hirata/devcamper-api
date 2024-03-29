import path from 'path';
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
        return res.status(StatusCodes.OK).json(res.advancedResults);
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
        req.body.user = req.user.id;

        // Check for published bootcamp
        const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

        // If the user is not an admin, they can only add one bootcamp
        if (publishedBootcamp && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(
                    `${req.user.id} has already published a bootcamp`,
                    StatusCodes.BAD_REQUEST
                )
            );
        }

        const bootcamp = await Bootcamp.create(req.body);
        return res.status(201).json({ sucess: true, data: bootcamp });
    });

    // @desc    Update bootcamp
    // @route   PUT /api/v1/bootcamps/:id
    // @access  Private
    update = asyncHandler(async (req, res, next) => {
        let bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return next(
                new ErrorResponse(
                    `Bootcamp not found with id of ${req.params.id}`,
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
                    `User ${req.user.id} is not authorized to update this bootcamp`,
                    StatusCodes.UNAUTHORIZED
                )
            );
        }

        bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

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

        // Make sure user is bootcamp owner
        if (
            bootcamp.user.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to delete this bootcamp`,
                    StatusCodes.UNAUTHORIZED
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

    // @desc    Upload bootcamp photo
    // @route   PUT /api/v1/bootcamps/:id/photos
    // @access  Private
    uploadPhoto = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return next(
                new ErrorResponse(
                    `Bootcamp not found with id of ${req.params.id}`,
                    StatusCodes.NOT_FOUND
                )
            );
        }

        if (!req.files) {
            return next(
                new ErrorResponse(
                    `Please upload a file`,
                    StatusCodes.BAD_REQUEST
                )
            );
        }

        const file = req.files.file;

        // Check file type
        if (!file.mimetype.startsWith('image')) {
            return next(
                new ErrorResponse(
                    `Please upload an image file`,
                    StatusCodes.BAD_REQUEST
                )
            );
        }

        // Check Filesize
        if (file.size > process.env.FILE_UPLOAD_MAX_SIZE) {
            return next(
                new ErrorResponse(
                    `Please upload an image less than ${proce.env.FILE_UPLOAD_MAX_SIZE}`,
                    StatusCodes.BAD_REQUEST
                )
            );
        }

        // Create custom file name
        file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

        file.mv(
            `${process.env.FILE_UPLOAD_PATH}/${file.name}`,
            async (error) => {
                if (error) {
                    console.log(error);
                    return next(
                        new ErrorResponse(
                            `Problem with file upload`,
                            StatusCodes.INTERNAL_SERVER_ERROR
                        )
                    );
                }

                await Bootcamp.findByIdAndUpdate(req.params.id, {
                    photo: file.name,
                });

                return res
                    .status(StatusCodes.OK)
                    .json({ sucess: true, data: file.name });
            }
        );
    });
}

export default new BootcampsController();
