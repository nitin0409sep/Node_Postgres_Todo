const { pool } = require("../db/connection");

module.exports.getProfile = async () => {
    try{
        const query = 'Select email from users';
        const res = await pool.query(query);
             
        const rows = res.rows;
        return {
            rows: rows
        };
    }catch(err){
        console.error("Error executing query:", error);
        throw error;
    }
}