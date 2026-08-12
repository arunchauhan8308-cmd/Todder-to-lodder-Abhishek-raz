const mongoose = require('mongoose')

// Connect the mongodb atlas 

const ConnectDB = async ()=> {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Database connected...")
    } catch (err) {
        console.log('MongoDB Error : ', err.message)
    }
}

module.exports = {
    ConnectDB
}