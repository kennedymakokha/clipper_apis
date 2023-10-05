var mongoose = require('mongoose')
var dotenv = require("dotenv");
dotenv.config();
// db config ;
module.exports = dbConfig = async () => {
    try {

        
        let db = mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // strictQuery: false
        })
        console.log("DB CONNCTED")
    } catch (error) {
        console.log("error", error);
    }
}