const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
let isConnected;

module.exports = connectToDatabase = () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }

  console.log('=> using new database connection');
  const url = process.env.DB;
  const options = {
    useNewUrlParser: true
  }
  return mongoose.connect(url, options)
    .then(db => { 
      isConnected = db.connections[0].readyState;
    }).catch(err => {
      console.error(err)
    });
};