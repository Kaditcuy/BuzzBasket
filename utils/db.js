const mongoose = require('mongoose');

// Define the MongoDb connection URI using environmental variables
const mongoURI = 'mongodb+srv://admin:admin123@buzzbasketapi.y4quf0f.mongodb.net/BuzzbasketDB?retryWrites=true&w=majority';
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
