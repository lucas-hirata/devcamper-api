export default function errorHandler(error, req, res, next) {
    console.log(err.stack.red);
    return req.status(error.statusCode || 500).json({
        sucess: false,
        error: error.message || 'Server Error',
    });
}
