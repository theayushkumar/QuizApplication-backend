const db = require("../config/db");

exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) reject(err);
      resolve(result[0]);
    });
  });
};

exports.createUser = (userData) => {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO users SET ?", userData, (err, result) => {
      if (err) reject(err);
      resolve({ id: result.insertId, ...userData });
    });
  });
};