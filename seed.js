const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect ('mongodb://localhost:27017/socialDB', {
    useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo connection open');
    })
    .catch((err) => {
        console.log(err);
    });

const seedUser = [
    {
        username: 'Fred Bear',
        email: 'fred@bear.com',
        thoughts: [],
        friends: []
    }
];

const seedDB = async () => {
    await User.deleteMany({});
    await User.insertMany(seedUser);
};

seedDB().then (()=> {
    mongoose.connection.close();
})



