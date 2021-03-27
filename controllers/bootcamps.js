import Bootcamp from '../models/Bootcamp';
import ErrorResponse from '../utils/errorResponse';

export default class BootcampsController {
    // @desc    List all bootcamps
    // @route   GET /api/v1/bootcamps
    // @access  Public
    async list(req, res, next) {
        try {
            const bootcamps = await Bootcamp.find();
            return res.status(200).json({
                sucess: true,
                count: bootcamps.length,
                data: bootcamps,
            });
        } catch (error) {
            res.status(400).json({ sucess: false });
        }
    }

    // @desc    Get single bootcamp
    // @route   GET /api/v1/bootcamps/:id
    // @access  Public
    async get(req, res, next) {
        try {
            const bootcamp = await Bootcamp.findById(req.params.id);

            if (!bootcamp) {
                return next(
                    new ErrorResponse(
                        `Bootcamp not found with id of ${req.params.id}`,
                        404
                    )
                );
            }

            return res.status(200).json({ sucess: true, data: bootcamp });
        } catch (error) {
            // res.status(400).json({ sucess: false });
            next(
                new ErrorResponse(
                    `Bootcamp not found with id of ${req.params.id}`,
                    404
                )
            );
        }
    }

    // @desc    Create new bootcamp
    // @route   POST /api/v1/bootcamps
    // @access  Private
    async create(req, res, next) {
        try {
            const bootcamp = await Bootcamp.create(req.body);
            return res.status(201).json({ sucess: true, data: bootcamp });
        } catch (error) {
            res.status(400).json({ sucess: false });
        }
    }

    // @desc    Update bootcamp
    // @route   PUT /api/v1/bootcamps/:id
    // @access  Private
    async update(req, res, next) {
        try {
            const bootcamp = await Bootcamp.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

            if (!bootcamp) {
                return res.status(400).json({ sucess: false });
            }

            return res.status(200).json({ sucess: true, data: bootcamp });
        } catch (error) {
            res.status(400).json({ sucess: false });
        }
    }

    // @desc    Delete bootcamp
    // @route   DELETE /api/v1/bootcamps/:id
    // @access  Private
    async delete(req, res, next) {
        try {
            const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

            if (!bootcamp) {
                return res.status(400).json({ sucess: false });
            }

            return res.status(200).json({ sucess: true, data: {} });
        } catch (error) {
            res.status(400).json({ sucess: false });
        }
    }
}
