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

        this.sendTokenResponse(user, StatusCodes.OK, res);
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

        this.sendTokenResponse(user, StatusCodes.OK, res);
    });

    // @desc    Get current logged in user
    // @route   POST /api/v1/auth/me
    // @acess   Private
    getMe = asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.user.id);
        return res.status(StatusCodes.OK).json({
            sucess: true,
            data: user,
        });
    });

    // @desc    Forgot password
    // @route   POST /api/v1/auth/forgotpassword
    // @acess   Public
    forgotPassword = asyncHandler(async (req, res, next) => {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(
                new ErrorResponse(
                    'There is no user with that email',
                    StatusCodes.NOT_FOUND
                )
            );
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        return res.status(StatusCodes.OK).json({
            sucess: true,
            data: resetToken,
        });
    });

    // Get token from model, create cookie and send response
    sendTokenResponse = (user, statusCode, res) => {
        // Create token
        const token = user.getSignedJwtToken();

        const options = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        };

        res.status(statusCode).cookie('token', token, options).json({
            sucess: true,
            token,
        });
    };
}

export default new AuthController();
