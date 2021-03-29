import ErrorResponse from '../utils/errorResponse';
import StatusCodes from 'http-status-codes';

export default function errorHandler(error, req, res, next) {
    let errorResponse = { ...error };
    errorResponse.message = error.message;

    console.log(error.stack.red);

    // Mongoose bad objectId
    if (error.name === 'CastError') {
        const message = `Resource not found with id of ${error.value}`;
        errorResponse = new ErrorResponse(message, StatusCodes.NOT_FOUND);
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
        const message = `Duplicate field value entered`;
        errorResponse = new ErrorResponse(message, StatusCodes.BAD_REQUEST);
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const message = Object.values(error.errors).map((val) => val.message);
        errorResponse = new ErrorResponse(message, StatusCodes.BAD_REQUEST);
    }

    return res
        .status(errorResponse.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
            sucess: false,
            error: errorResponse.message || 'Server Error',
        });
}
