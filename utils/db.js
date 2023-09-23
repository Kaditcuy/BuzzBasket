const mongoose = require('mongoose');

// Define the MongoDb connection URI using environmental variables
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buzzbasket-databse';
// Create a Mongoose instance and connect to the database
mongoose.set('debug', true);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((error) => {
  console.error('MongoDB connection error', error);
});

module.exports = mongoose;
