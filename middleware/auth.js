import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler';
import ErrorResponse from '../utils/errorResponse';
import StatusCodes from 'http-status-codes';
import User from '../models/User';

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return next(
            new ErrorResponse(
                'Not authorized to acess this resource',
                StatusCodes.UNAUTHORIZED
            )
        );
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        return next(
            new ErrorResponse(
                'Not authorized to acess this resource',
                StatusCodes.UNAUTHORIZED
            )
        );
    }
});

export { protect };
