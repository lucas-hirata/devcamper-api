import User from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import sendEmail from '../utils/sendEmail';
import asyncHandler from '../middleware/asyncHandler';
import crypto from 'crypto';
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

        //Crete reset url
        const resetUrl = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/resetpassword/${resetToken}`;

        const message = {
            email: user.email,
            subject: 'DevCamper - Password Reset Request',
            text: `You are receiving this email because you requested a password reset. If this wasn\'t you, ignore this email. Else, please acess the following link to continue: ${resetUrl}`,
        };

        try {
            await sendEmail(message);

            res.status(StatusCodes.OK).json({
                sucess: true,
                data: 'Email sent',
            });
        } catch (error) {
            console.log(error);
            user.getResetPasswordToken = undefined;
            user.getResetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return next(new ErrorResponse('Email could not be sent.'));
        }

        return res.status(StatusCodes.OK).json({
            sucess: true,
            data: user,
        });
    });

    // @desc    Reset password
    // @route   PUT /api/v1/auth/resetpassword/:resettoken
    // @acess   Private
    resetPassword = asyncHandler(async (req, res, next) => {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return next(
                new ErrorResponse('Invalid Token', StatusCodes.BAD_REQUEST)
            );
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        this.sendTokenResponse(user, StatusCodes.OK, res);
    });

    // @desc    Update details
    // @route   POST /api/v1/auth/forgotpassword
    // @acess   Public
    updateDetails = asyncHandler(async (req, res, next) => {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
        };

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true,
        });

        return res.status(StatusCodes.OK).json({
            sucess: true,
            data: user,
        });
    });

    // @desc    Update password
    // @route   PUT /api/v1/auth/updatepassword
    // @acess   Private
    updatePassword = asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return next(
                new ErrorResponse(
                    'Password is incorrect',
                    StatusCodes.FORBIDDEN
                )
            );
        }

        user.password = req.body.newPassword;
        await user.save();

        this.sendTokenResponse(user, StatusCodes.OK, res);
    });

    // @desc    Signout
    // @route   GET /api/v1/auth/signout
    // @acess   Private
    logout = asyncHandler(async (req, res, next) => {
        this.clearTokenResponse(StatusCodes.OK, res);
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

    // Get token from model, create cookie and send response
    clearTokenResponse = (statusCode, res) => {
        // Create token
        const token = '';

        const options = {
            expires: new Date(Date.now() + 1 * 60 * 1000),
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
