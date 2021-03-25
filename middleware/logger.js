// @desc    Logs request to console
export default function logger(req, res, next) {
    console.log(
        `${req.method} ${req.protocol}://${req.host}${req.originalUrl}`
    );
    next();
}
