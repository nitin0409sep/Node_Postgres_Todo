const { pool } = require("../db-config/connection");

// Get ALl Items
module.exports.getAllItems = async (page = 0, limit = 10) => {
  try {
    const offset = page * limit;
    //   const query = `SELECT * FROM todo where value LIKE '%${search}%'`;
    const query = `SELECT * FROM todo ORDER BY VALUE limit ${limit} OFFSET ${offset}`;
    const countQuery = `SELECT COUNT(*) FROM TODO`;
    const { rows } = await pool.query(query);
    const toalCount = await pool.query(countQuery);

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
module.exports.getSpecificItem = async (id) => {
  try {
    const query = `Select * from todo where id = ${id}`;
    const { rows } = await pool.query(query);
    const toalCount = rows.length;

    return {
      count: toalCount,
      rows: rows,
    };
  } catch (err) {
    console.error("Error executing query:", error);
    throw err;
  }
};

// Add Item or Items
module.exports.postItem = async (value) => {
  try {
    await pool.query("BEGIN");

    for (let item of value) {
      const query = `
          insert into todo(value)
          VALUES ('${item}')`;

      const result = await pool.query(query);

      if (result.rowCount === 0) {
        await pool.query("ROLLBACK");
        return res.status(500).json({ error: `Invalid Data` });
      }
    }

    const response = await pool.query("COMMIT");
    return response;
  } catch (error) {
    throw error;
  }
};

// Update Item
module.exports.updateItem = async (id, value) => {
  try {
    // string literals should be enclosed in single quotes, not double quotes
    const query = `update todo set value = '${value}' where id = ${id}`;
    const res = await pool.query(query);

    return res;
  } catch (error) {
    throw error;
  }
};

// Delete Item
module.exports.deleteItem = async (id) => {
  try {
    const query = `Delete from todo where id = ${id}`;
    const res = await pool.query(query);

    return res;
  } catch (err) {
    throw err;
  }
};

// Delete Multiple Items
module.exports.deleteMultipleItems = async (ids, res) => {
  try {
    await pool.query("BEGIN");

    for (const id of ids) {
      const query = `DELETE FROM todo WHERE id = ${id}`;
      const result = await pool.query(query);

      if (result.rowCount === 0) {
        await pool.query("ROLLBACK");
        return res
          .status(500)
          .json({ error: `Item with ID ${id} does not exist` });
      }
    }

    const response = await pool.query("COMMIT");
    return response;
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    throw err;
  }
};

// Delete All Items
module.exports.deleteAllItems = async (req, res) => {
  try {
    const { rows } = await pool.query('Select count(value) from todo');

    if (!(+rows[0].count)) {
      return { message: "No Items Exists" };
    };

    const query = `TRUNCATE TABLE todo;`;
    await pool.query(query);

    return { message: "All items have been deleted successfully" };
  } catch (err) {
    return res.status(500).json({ error: "An error occurred while deleting items" });
  }
};
