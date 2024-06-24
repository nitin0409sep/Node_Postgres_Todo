const { pool } = require("../db-config/connection");

// Get ALl Items
module.exports.getAllItems = async (user_id, page = 0, limit = 10) => {
  try {
    const offset = page * limit;

    //   const query = `SELECT * FROM todo where value LIKE '%${search}%'`;
    const query = `SELECT * FROM todo WHERE user_id = $1 ORDER BY id LIMIT $2 OFFSET $3`;
    const values = [user_id, limit, offset];

    const countQuery = `SELECT COUNT(*) FROM TODO where user_id = $1`;
    const { rows } = await pool.query(query, values);
    const toalCount = await pool.query(countQuery, [user_id]);

    return {
      count: toalCount.rows[0].count,
      rows: rows,
    };
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

// Get Specific Item By ID
module.exports.getSpecificItem = async (user_id, id) => {
  try {
    const query = `SELECT * FROM todo WHERE user_id = $1 AND id = $2`;
    const values = [user_id, id];
    const { rows } = await pool.query(query, values);

    const totalCount = rows.length;

    return {
      count: totalCount,
      rows: rows,
    };
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
};

// Add Item or Items
module.exports.postItem = async (user_id, value) => {
  try {
    await pool.query("BEGIN");
    
    for (let item of value) {
      const query = ` 
          insert into todo(user_id, value)
          VALUES ('${user_id}', '${item}')`;

      const result = await pool.query(query);

      if (result.rowCount === 0) {
        await pool.query("ROLLBACK");
        return res.status(500).json({ error: `Invalid Data` });
      }
    }

    const response = await pool.query("COMMIT");
    return response;
  } catch (err) {
    console.log(err);
    throw error;
  }
};

// Update Item
module.exports.updateItem = async (user_id, id, value) => {
  try {
    // string literals should be enclosed in single quotes, not double quotes
    const query = `update todo set value = $1 where user_id = $2 AND id = $3 returning *`;
    const values = [value, user_id, id]
    const res = await pool.query(query, values);

    if (res.rowCount === 0) {
      return {
        success: false,
        message: "No rows updated. The user_id or item id might be incorrect."
      };
    }

    return {
      success: true,
      data: res.rows[0],
      message: `Item with ID ${id} Update successful.`
    };
  } catch (error) {
    throw error;
  }
};

// Delete Item
module.exports.deleteItem = async (user_id, id) => {
  try {
    const { rows } = await pool.query('Select count(value) from todo where user_id = $1', [user_id]);

    if (!(+rows[0].count)) {
      return { success: false, message: "No Items Exists" };
    };

    const query = `Delete from todo where user_id = $1 AND id = $2`;
    const values = [user_id, id];
    const res = await pool.query(query, values);

    if (res.rowCount === 0) {
      return {
        success: false,
        message: "No rows deleted. The user_id or item id might be incorrect."
      };
    }

    return {
      success: true,
      data: res.rows[0],
      message: `Item with ID ${id} deleted successful.`
    };
  } catch (err) {
    throw err;
  }
};

// Delete Multiple Items
module.exports.deleteMultipleItems = async (ids, res) => {
  try {
    const { rows } = await pool.query('Select count(value) from todo where user_id = $1', [user_id]);

    if (!(+rows[0].count)) {
      return { success: false, message: "No Items Exists" };
    };

    await pool.query("BEGIN");

    for (const id of ids) {
      const query = `DELETE FROM todo WHERE user_id = $1 AND id = $2`;
      const values = [user_id, id];
      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        await pool.query("ROLLBACK");
        return {
          success: false,
          message: "No rows deleted. The user_id or item id might be incorrect."
        };
      }
    }

    await pool.query("COMMIT");
    return {
      success: true,
      message: `Item with ID ${id} deleted successful.`,
      error: null,
    };

  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    throw err;
  }
};

// Delete All Items -- FOR ADMIN ONLT
module.exports.deleteAllItems = async (req, res) => {
  try {
    const { rows } = await pool.query('Select count(value) from todo');

    if (!(+rows[0].count)) {
      return { success: false, message: "No Items Exists" };
    };

    const query = `TRUNCATE TABLE todo;`;
    await pool.query(query);

    return { success: 'true', message: "All items have been deleted successfully" };
  } catch (err) {
    return res.status(500).json({ error: "An error occurred while deleting items" });
  }
};
