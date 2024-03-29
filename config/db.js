import mongoose from 'mongoose';

async function connectDb() {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });

    console.log(
        `MONGODB Connected: ${connection.connection.host}`.cyan.underline.bold
    );
}

export default connectDb;
