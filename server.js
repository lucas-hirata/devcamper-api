import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import errorHandler from './middleware/error';
import connectDb from './config/db';

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to Database
connectDb();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev', {}));
}

app.get('/', (request, response) => {
    response.status(200).send('Server up and running.');
});

// Route files
import bootcampsRoute from './routes/bootcamps';

// Mount routers
app.use('/api/v1/bootcamps', bootcampsRoute);

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
