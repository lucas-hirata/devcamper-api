import User from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/asyncHandler';
import StatusCodes from 'http-status-codes';

class UserController {
    // @desc    List users
    // @route   GET /api/v1/users
    // @acess   Private/Admin
    list = asyncHandler(async (req, res, next) => {
        res.status(StatusCodes.OK).json(res.advancedResults);
    });

    // @desc    Get single user
    // @route   GET /api/v1/users/:id
    // @acess   Private/Admin
    get = asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.params.id);

        res.status(StatusCodes.OK).json({
            sucess: true,
            data: user,
        });
    });

    // @desc    Create user
    // @route   POST /api/v1/users/
    // @acess   Private/Admin
    insert = asyncHandler(async (req, res, next) => {
        const user = await User.create(req.body);

        res.status(StatusCodes.CREATED).json({
            sucess: true,
            data: user,
        });
    });

    // @desc    Update user
    // @route   PUT /api/v1/users/:id
    // @acess   Private/Admin
    update = asyncHandler(async (req, res, next) => {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(StatusCodes.OK).json({
            sucess: true,
            data: user,
        });
    });

    // @desc    Delete user
    // @route   DELETE /api/v1/users/:id
    // @acess   Private/Admin
    delete = asyncHandler(async (req, res, next) => {
        await User.findByIdAndDelete(req.params.id);

        res.status(StatusCodes.OK).json({
            sucess: true,
            data: {},
        });
    });
}
