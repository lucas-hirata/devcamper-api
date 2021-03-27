import './config/config';
import fs from 'fs';
import colors from 'colors';
import connectDb from './config/db';

// Connect to Database
connectDb();

// Load Models
import Bootcamp from './models/Bootcamp';
import Course from './models/Course';

// Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${process.env.PWD}/_data/bootcamps.json`),
    'utf-8'
);

const courses = JSON.parse(
    fs.readFileSync(`${process.env.PWD}/_data/courses.json`),
    'utf-8'
);

// Import into Database
async function importData() {
    try {
        await Bootcamp.create(bootcamps);
        console.log('courses: ' + courses);
        await Course.create(courses);

        console.log('Data imported...'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit();
    }
}

// Delete from database
async function deleteData() {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();

        console.log('Data Destroyed...'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
