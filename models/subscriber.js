var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

require("middlewares/auth.middleware");

const Schema = mongoose.Schema;
const SubscriberSchema = new Schema({
    email: {
        type: String,
    },
    company: {
        type: String,
    },

}, { timestamps: true });



module.exports = mongoose.model('subscriber', SubscriberSchema);