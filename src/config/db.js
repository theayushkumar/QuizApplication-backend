const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((error) => {
    if (error) {
        console.log('database connection failed');
        console.log(error);
    } else {
        console.log('database connected successfully');
    }
});

module.exports = connection;


// for online work 

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//     connectTimeout: 60000
// });

// // test database connection
// pool.getConnection((error, connection) => {
//     if (error) {
//         console.log('database connection failed');
//         console.log(error);
//     } else {
//         console.log('database connected successfully');
//         connection.release();
//     }
// });

// module.exports = pool.promise();