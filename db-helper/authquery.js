const { pool } = require('../db-config/connection');
const bcrypt = require('bcrypt');

// GET ALL USERS
module.exports.getUsers = async () => {
    try {
        const query = 'Select * from users';
        const { rows } = await pool.query(query);
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// REGISTER USERS
module.exports.registerUser = async (user_name, email, password) => {
    try {
        const query = `INSERT INTO USERS(USER_NAME, EMAIL, PASSWORD) VALUES($1, $2, $3) RETURNING *`;

        const result = await pool.query(query, [user_name, email, password]);

        // Check if the insertion was successful
        return result.rowCount > 0 ? result.rows[0] : false;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// LOGIN USERS
module.exports.loginUser = async (email, password) => {
    try {
        const query = 'Select * from users where email = $1'
        const { rows } = await pool.query(query, [email]);

        // Validate Password
        const validPassword = await bcrypt.compare(password, rows[0].password);
        return validPassword ? true : false;
    } catch (err) {
        throw err;
    }
}

// Check user already exists or not
module.exports.checkUserExists = async (email) => {
    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await pool.query(query, [email]);
        return rows[0] ?? false;
    } catch (err) {
        console.log(err);
        throw err;
    }
};
