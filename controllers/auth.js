import User from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/asyncHandler';
import StatusCodes from 'http-status-codes';

class AuthController {
    // @desc    Register user
    // @route   POST /api/v1/auth/register
    // @acess   Public
    register = asyncHandler(async (req, res, next) => {
        const { name, email, password, role } = req.body;

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        // Create token
        const token = user.getSignedJwtToken();

        return res.status(StatusCodes.CREATED).json({
            sucess: true,
            token,
        });
    });

    // @desc    Login user
    // @route   POST /api/v1/auth/login
    // @acess   Public
    login = asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;

        // Validates email and password
        if (!email || !password) {
            return next(
                new ErrorResponse(
                    `Please provide an email and password`,
                    StatusCodes.BAD_REQUEST
                )
            );
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(
                new ErrorResponse(
                    `Invalid credentials`,
                    StatusCodes.UNAUTHORIZED
                )
            );
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(
                new ErrorResponse(
                    `Invalid credentials`,
                    StatusCodes.UNAUTHORIZED
                )
            );
        }

        // Create token
        const token = user.getSignedJwtToken();

        return res.status(StatusCodes.CREATED).json({
            sucess: true,
            token,
        });
    });
}

export default new AuthController();
