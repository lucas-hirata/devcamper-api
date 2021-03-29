import path from 'path';
import './config/config';
import express from 'express';
import morgan from 'morgan';
import colors from 'colors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import connectDb from './config/db';
import errorHandler from './middleware/errorHandler';

// Connect to Database
connectDb();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev', {}));
}

// File Upload
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(process.env.PWD, 'public')));

app.get('/', (request, response) => {
    response.status(200).send('Server up and running.');
});

// Route files
import bootcampsRoute from './routes/bootcamps';
import coursesRoute from './routes/courses';
import authRoute from './routes/auth';

// Mount routers
app.use('/api/v1/bootcamps', bootcampsRoute);
app.use('/api/v1/courses', coursesRoute);
app.use('/api/v1/auth', authRoute);

// Mount error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
            .bold
    )
);

// Default unhandled promise rejection handler
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server and exit process
    server.close(() => process.exit(1));
});
