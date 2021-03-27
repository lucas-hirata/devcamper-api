import './config/config';
import fs from 'fs';
import colors from 'colors';
import connectDb from './config/db';

// Connect to Database
connectDb();

// Load Models
import Bootcamp from './models/Bootcamp';

// Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${process.env.PWD}/_data/bootcamps.json`),
    'utf-8'
);

// Import into Database
async function importData() {
    try {
        await Bootcamp.create(bootcamps);

        console.log('Data imported...'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

// Delete from database
async function deleteData() {
    try {
        await Bootcamp.deleteMany();

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
