const mongoose = require('mongoose')
const connectionUrl = 'mongodb://localhost:27017/iNoteBook'

const connectToMongo = () => {
    mongoose.connect(connectionUrl).then( () => {
        console.log('Connected to Mongo Successfully ...')
    }).catch((err) => {
        console.log('Error occured in connection with MongoDB ...',err)
    })
}

module.exports = connectToMongo;