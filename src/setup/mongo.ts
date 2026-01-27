import { config } from 'dotenv';
import mongoose from 'mongoose';

config();

const MONGO_URL = `${process.env.MONGO_URL}` || '';

mongoose.connect(MONGO_URL);

export const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Database connected successfully');
});

export default mongoose;
