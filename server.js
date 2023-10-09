require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

var path = require("path");
var mongoose = require('mongoose')
var path = require('path');
var dotenv = require("dotenv");
app.use(morgan("tiny"));
var Lab = require("./iolab.io");
const dbConfig = require("./db.config");
var http = require("http").createServer(app);
var msg = require("./routes/message.route");
var authRoute = require("./routes/auth.route");
var mails = require("./routes/mail.route");
app.use(express.static(path.join(__dirname, "public")));
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


dbConfig()

// app.get("*", (req, res) => {
//   res.sendFile('index.html', { root });
// })

// api routes
// app.use('/api/', callingRoute)
app.use('/api/', authRoute)
app.use('/api/', msg)
app.use('/api/', mails)

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.static(path.join(__dirname, 'client/build')));

const root = require('path').join(__dirname, '..', 'build')
app.use(express.static(root));
// app.get("*", (req, res) => {
//   res.sendFile('index.html', { root });
// })
app.get('*', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '../build') });
});

// app.get("*", (req, res) => {
//     res.sendFile('index.html', { root });
// })


// start server
const port =
    process.env.NODE_ENV === "production" ? process.env.PORT || 1880 : 1880;
http.listen(port, () => console.log("Server listening on port " + port));
// const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80):80;
// http.listen(port, () => console.log('Server listening on port ' + port));

let io = Lab(http);
global.io = io;
