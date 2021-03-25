import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

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

const PORT = process.env.PORT || 5000;
app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);
