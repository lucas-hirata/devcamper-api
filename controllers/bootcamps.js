import Bootcamp from '../models/Bootcamp';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/asyncHandler';
import geocodes from '../utils/geocoder';
import geocoder from '../utils/geocoder';
import { query } from 'express';

export default class BootcampsController {
    // @desc    List all bootcamps
    // @route   GET /api/v1/bootcamps
    // @access  Public
    list = asyncHandler(async (req, res, next) => {
        let requestQuery = { ...req.query };

        const paramsToRemove = ['select', 'sort', 'page', 'limit'];

        paramsToRemove.forEach((param) => delete requestQuery[param]);

        let queryString = JSON.stringify(requestQuery);
        queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

        let query = Bootcamp.find(JSON.parse(queryString));

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
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        const bootcamps = await query;
        return res.status(200).json({
            sucess: true,
            count: bootcamps.length,
            data: bootcamps,
        });
    });

    // @desc    Get single bootcamp
    // @route   GET /api/v1/bootcamps/:id
    // @access  Public
    get = asyncHandler(async (req, res, next) => {
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
                    404
                )
            );
        }

        return res.status(200).json({ sucess: true, data: bootcamp });
    });

    // @desc    Delete bootcamp
    // @route   DELETE /api/v1/bootcamps/:id
    // @access  Private
    delete = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if (!bootcamp) {
            return next(
                new ErrorResponse(
                    `Bootcamp not found with id of ${req.params.id}`,
                    404
                )
            );
        }

        return res.status(200).json({ sucess: true, data: {} });
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

        res.status(200).json({
            sucess: true,
            count: bootcamps.length,
            data: bootcamps,
        });
    });
}
