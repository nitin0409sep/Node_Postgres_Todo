const { pool } = require('../../database/db-config/connection');

//? GET ALL COMMENTS
module.exports.getAllComments = async (user_id, task_id) => {
    try {
        const query = `SELECT * FROM comments WHERE user_id = $1 and id = $2 ORDER BY id`;
        const values = [user_id, task_id];

        const { rows } = await pool.query(query, values);

        return {
            rows: rows,
        };
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
};

//? ADD COMMENTS
module.exports.postComment = async (user_id, id, comment) => {
    try {
        await pool.query("BEGIN"); // Start the transaction

        const query = `INSERT INTO comments(USER_ID, id, COMMENT) VALUES($1, $2, $3) RETURNING *`;
        const values = [user_id, id, comment];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            await pool.query("ROLLBACK"); // Rollback if no rows are affected
            throw err;
        }

        await pool.query("COMMIT");
    } catch (err) {
        await pool.query("ROLLBACK");
        console.error('Transaction Error:', err); // Log the error
        throw err;
    }
}

//? UPDATE COMMENTS
module.exports.updateComment = async (id, comment_id, comment) => {
    try {
        await pool.query("BEGIN"); // Start the transaction

        const query = `update comments set comment=$1 where id = $2 AND comment_id = $3 returning *`;
        const values = [comment, id, comment_id];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            await pool.query("ROLLBACK"); // Rollback if no rows are affected
            return {
                success: false,
                message: "No rows updated. The user_id or item id might be incorrect."
            };
        }

        await pool.query("COMMIT");

        return {
            success: true,
            data: result.rows[0],
            message: `Comment with ID ${id} Update successful.`
        };
    } catch (err) {
        await pool.query("ROLLBACK");
        console.error('Transaction Error:', err); // Log the error
        throw err;
    }
}

//? DELETE COMMENT
module.exports.deleteComment = async (user_id, task_id, comment_id) => {
    try {
        const { rows } = await pool.query('Select count(*) from comments where user_id = $1 and id = $2 and comment_id = $3', [user_id, task_id, comment_id]);

        if (!(+rows[0].count)) {
            return { success: false, message: "No Comment Exists" };
        };

        const query = `Delete from comments where user_id = $1 AND id = $2 and comment_id = $3`;
        const values = [user_id, task_id, comment_id];

        const res = await pool.query(query, values);

        console.log(res);

        if (res.rowCount === 0) {
            return {
                success: false,
                message: "No rows deleted. The user_id or item id or comment_id might be incorrect."
            };
        }

        return {
            success: true,
            data: res.rows[0],
            message: `Comment deleted successfully.`
        };
    } catch (err) {
        throw err;
    }
};

//? DELETE ALL COMMENTS
module.exports.deleteAllComments = async (user_id, id) => {
    try {
        const { rows } = await pool.query('Select count(*) from comments where user_id = $1 and id = $2', [user_id, id]);

        if (!(+rows[0].count)) {
            return { success: false, message: "No Comment Exists" };
        };

        await pool.query("BEGIN");
        while (rows.length > 0) {
            rows.length--;

            const query = `DELETE FROM comments WHERE user_id = $1 and id = $2`;
            const values = [user_id, id];
            const result = await pool.query(query, values);

            if (result.rowCount === 0) {
                await pool.query("ROLLBACK");
                return {
                    success: false,
                    message: "No rows deleted. The user_id or item id or comment_id might be incorrect."
                };
            }
        }

        await pool.query("COMMIT");
        return {
            success: true,
            message: `All comments deleted successful.`,
            error: null,
        };

    } catch (err) {
        await pool.query("ROLLBACK");
        console.error(err);
        throw err;
    }
};