// require('dotenv').config();

// const app = require('./app');
// require('./config/db');

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`server running on port ${PORT}`);
// });



require('dotenv').config();

const app = require('./app');
const mysql = require('mysql2');

// mysql connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// connect database
connection.connect((err) => {
    if (err) {
        console.log('database connection failed');
        console.log(err);
    } else {
        console.log('database connected successfully');
    }
});

// optional export
module.exports = connection;

// server port
const PORT = process.env.PORT || 5000;

// start server
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});