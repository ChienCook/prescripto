import mongoose from 'mongoose';

const connectDB = async () => {
    // inform if connected successfuly
    mongoose.connection.on('connected', () => console.log('Database Connected'));

    // creating the prescripto database in mongodb
    await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
};

export default connectDB;
