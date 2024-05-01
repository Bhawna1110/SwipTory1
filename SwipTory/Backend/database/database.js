const mongoose = require('mongoose');


mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB:', err.message));


module.exports = mongoose 
