const dbHelper = require("../db-helper/todoqueries");

// GET ITEMS
module.exports.getItems = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const user_id = req.user.unique_id;

    const values = await dbHelper.getAllItems(user_id, page, limit);

    if (search !== undefined) {
      const data = values.rows.filter((val) => {
        return val.value.toLowerCase().includes(search.toLowerCase());
      });
      return res.status(200).json({
        data: { count: data.length, items: data },
        error: null,
        status: "OK",
      });
    }

    return res.status(200).json({
      data: { count: values.count, items: values.rows },
      error: null,
      status: "OK",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("An error occurred while getting the items.");
  }
};

// GET SPECIFIC ITEMS
module.exports.getSpecificItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.unique_id;
    const value = await dbHelper.getSpecificItem(user_id, id);

    return res.status(200).json({
      data: { count: value.count, items: value.rows },
      error: null,
      status: "OK",
    });
  } catch (err) {
    return res
      .status(500)
      .josn({ error: `An error occurred while getting the item.` });
  }
};

// POST ITEM or ITEMS
module.exports.postItem = async (req, res) => {
  try {
    // Request body should be an array
    if (!Array.isArray(req.body.value)) {
      return res
        .status(400)
        .json({ error: "Value should be an array of strings" });
    }

    const user_id = req.user.unique_id;

    await dbHelper.postItem(user_id, req.body?.value);
    return res
      .status(201)
      .json({ message: `Item added successfully`, error: null, status: "OK" });
  } catch (error) {
    return res
      .status(500)
      .send({ error: `An error occurred while adding the item.` });
  }
};

// UPDATE ITEM
module.exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    if (value) {
      const user_id = req.user.unique_id;

      const result = await dbHelper.updateItem(user_id, id, value);

      return result.success ? res.status(200).json({
        message: result.message,
        error: null,
        status: "OK",
      })
        : res.status(400).json({
          error: result.message,
        });


    } else {
      return res.status(400).json({ error: "Invalid Data" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while updating the item." });
  }
};

// DELETE VALUE
module.exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const user_id = req.user.unique_id;

    const result = await dbHelper.deleteItem(user_id, id);

    if (result.success) {
      return res.status(200).json({
        message: result.message,
        error: null,
        status: "OK",
      });
    } else {
      return res.status(404).json({
        error: result.message,
        status: "Not Found",
      });
    }

  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the item." });
  }
};

// DELETE MULTIPLE ITEMS
module.exports.deleteMultipleItems = async (req, res) => {
  try {
    const ids = req.query.id.split(",").map(Number);

    const user_id = req.user.unique_id;

    const result = await dbHelper.deleteMultipleItems(user_id, ids, res);;

    if (result.success) {
      return res.status(200).json({
        message: result.message,
        error: null,
        status: "OK",
      });
    } else {
      return res.status(404).json({
        error: result.message,
        status: "Not Found",
      });
    }

  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting items", error: error.message });
  }
};

// DELETE ALL ITEMS -- FOR ADMIN ONLY
module.exports.deleteAllItems = async (req, res) => {
  try {
    const user_id = req.user.unique_id;

    const value = await dbHelper.deleteAllItems(user_id, req, res);

    res.json({
      message: value.message,
      error: null,
      status: "OK",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting items", error: err });
  }
}