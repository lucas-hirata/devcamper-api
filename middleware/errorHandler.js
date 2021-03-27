import ErrorResponse from '../utils/errorResponse';

export default function errorHandler(error, req, res, next) {
    let errorResponse = { ...error };
    errorResponse.message = error.message;

    console.log(error.stack.red);

    // Mongoose bad objectId
    if (error.name === 'CastError') {
        const message = `Resource not found with id of ${error.value}`;
        errorResponse = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
        const message = `Duplicate field value entered`;
        errorResponse = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const message = Object.values(error.errors).map((val) => val.message);
        errorResponse = new ErrorResponse(message, 400);
    }

    return res.status(errorResponse.statusCode || 500).json({
        sucess: false,
        error: errorResponse.message || 'Server Error',
    });
}
